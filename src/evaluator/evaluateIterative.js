import { isEmpty } from "lodash";
import specialForms from "./specialForms";
import { getJavascriptGlobal } from "./interop";
import evaluatorContext from "./evaluatorContext";
import invokeFunction from "./invokeFunction";
import invokeMacro from "./invokeMacro";
import invokeMethod from "./invokeMethod";
import mergeArgs from "./mergeArgs";
import { canApplyAutoCurrying } from "./invokeLambda";
import Env from "./env/Env";
import DotPunctuator from "../types/DotPunctuator";
import Lambda from "../types/Lambda";
import Macro from "../types/Macro";
import MethodCall from "../types/MethodCall";
import MultiMethod from "../types/MultiMethod";
import OverloadedLambda from "../types/OverloadedLambda";
import SpecialForm from "../types/SpecialForm";
import Symbl from "../types/Symbl";

const binaryOperators = {
  "+": (left, right) => left + right,
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => left / right,
  "//": (left, right) => Math.floor(left / right),
  "%": (left, right) => left % right,
  pow: (left, right) => Math.pow(left, right),
  sqrt: (left, right) => Math.sqrt(left, right),
  max: (left, right) => Math.max(left, right),
  min: (left, right) => Math.min(left, right),
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  "=": (left, right) => left === right,
  "!=": (left, right) => left !== right
};

const comparisonOperators = new Set([">", "<", ">=", "<=", "=", "!="]);

function evaluateSymbol({ name }, env) {
  if (name in specialForms) {
    return specialForms[name];
  }
  if (name[0] === ".") {
    return new MethodCall(name.substr(1));
  }
  if (name.substr(0, 3) === "js/") {
    return getJavascriptGlobal(name.substr(3));
  }
  return env.get(name);
}

function checkTimeout() {
  const nowTime = Date.now();
  const { startTime = nowTime, timeout } = evaluatorContext.get("options");
  if (nowTime - startTime > timeout) {
    throw new Error("Evaluation interrupted: timeout");
  }
}

function specialFormName(form) {
  return Object.keys(specialForms).find(name => specialForms[name] === form);
}

function createLambdaResult(lambda, argValues) {
  if (
    canApplyAutoCurrying(lambda) &&
    lambda.args.length > argValues.length
  ) {
    const boundFrame = mergeArgs(
      lambda.args.slice(0, argValues.length),
      argValues
    );
    return {
      value: new Lambda(
        lambda.args.slice(argValues.length),
        lambda.body,
        new Env(boundFrame, lambda.env)
      )
    };
  }

  return {
    exprs: lambda.body,
    env: new Env(mergeArgs(lambda.args, argValues), lambda.env)
  };
}

export function evaluateExpressionIterative(initialExpr, initialEnv) {
  let expr = initialExpr;
  let env = initialEnv;
  let result;
  let evaluating = true;
  const frames = [];

  const evaluateNext = (nextExpr, nextEnv = env) => {
    expr = nextExpr;
    env = nextEnv;
    evaluating = true;
  };

  const returnValue = value => {
    result = value;
    evaluating = false;
  };

  while (evaluating || frames.length > 0) {
    checkTimeout();

    if (evaluating) {
      if (expr instanceof Symbl) {
        returnValue(evaluateSymbol(expr, env));
      } else if (expr instanceof Map) {
        const entries = [...expr.entries()];
        if (isEmpty(entries)) {
          returnValue(new Map());
        } else {
          frames.push({ type: "map", entries, index: 0, values: [], env });
          evaluateNext(entries[0][0]);
        }
      } else if (Array.isArray(expr)) {
        if (isEmpty(expr)) {
          returnValue([]);
        } else {
          frames.push({ type: "call-head", args: expr.slice(1), env });
          evaluateNext(expr[0]);
        }
      } else if (expr instanceof DotPunctuator) {
        throw new Error("Syntax error");
      } else {
        returnValue(expr);
      }
      continue;
    }

    const frame = frames.pop();

    if (frame.type === "sequence") {
      if (frame.index >= frame.exprs.length) {
        returnValue(result);
      } else {
        frames.push({ ...frame, index: frame.index + 1 });
        evaluateNext(frame.exprs[frame.index], frame.env);
      }
      continue;
    }

    if (frame.type === "call-head") {
      const formName =
        result instanceof SpecialForm ? specialFormName(result) : undefined;

      if (formName === "begin") {
        frames.push({
          type: "sequence",
          exprs: frame.args,
          index: 1,
          env: frame.env
        });
        if (isEmpty(frame.args)) {
          returnValue(undefined);
        } else {
          evaluateNext(frame.args[0], frame.env);
        }
      } else if (formName === "cond") {
        frames.push({
          type: "cond",
          pairs: frame.args,
          index: 0,
          env: frame.env
        });
        returnValue(undefined);
      } else if (formName in binaryOperators || ["and", "or", "not"].includes(formName)) {
        frames.push({
          type: "operator",
          name: formName,
          args: frame.args,
          index: 0,
          values: [],
          env: frame.env
        });
        returnValue(undefined);
      } else if (result instanceof SpecialForm) {
        returnValue(result.perform(frame.env, frame.args, true));
      } else if (result instanceof Macro) {
        returnValue(invokeMacro(result, frame.args, frame.env));
      } else {
        frames.push({
          type: "call-args",
          callable: result,
          args: frame.args,
          index: 0,
          values: [],
          afterDot: false,
          env: frame.env
        });
        returnValue(undefined);
      }
      continue;
    }

    if (frame.type === "call-args") {
      if (frame.index > 0) {
        if (frame.afterDot) {
          if (!Array.isArray(result)) {
            throw new Error("Could not spread non-list value");
          }
          frame.values.push(...result);
          frame.afterDot = false;
        } else {
          frame.values.push(result);
        }
      }

      while (
        frame.index < frame.args.length &&
        frame.args[frame.index] instanceof DotPunctuator
      ) {
        frame.afterDot = true;
        frame.index += 1;
      }

      if (frame.index < frame.args.length) {
        const nextArg = frame.args[frame.index];
        frames.push({ ...frame, index: frame.index + 1 });
        evaluateNext(nextArg, frame.env);
        continue;
      }

      const { callable, values } = frame;
      if (callable instanceof OverloadedLambda) {
        const applied = createLambdaResult(callable.getVariant(values.length), values);
        if ("value" in applied) {
          returnValue(applied.value);
        } else {
          frames.push({ type: "sequence", exprs: applied.exprs, index: 1, env: applied.env });
          evaluateNext(applied.exprs[0], applied.env);
        }
      } else if (callable instanceof Lambda) {
        const applied = createLambdaResult(callable, values);
        if ("value" in applied) {
          returnValue(applied.value);
        } else if (isEmpty(applied.exprs)) {
          returnValue(undefined);
        } else {
          frames.push({ type: "sequence", exprs: applied.exprs, index: 1, env: applied.env });
          evaluateNext(applied.exprs[0], applied.env);
        }
      } else if (callable instanceof MultiMethod) {
        const [dispatchValue, ...args] = values;
        const method = callable.methods.get(dispatchValue);
        if (!method) {
          throw new TypeError(`Method not found for value "${dispatchValue}"`);
        }
        const applied = createLambdaResult(method, args);
        if ("value" in applied) {
          returnValue(applied.value);
        } else {
          frames.push({ type: "sequence", exprs: applied.exprs, index: 1, env: applied.env });
          evaluateNext(applied.exprs[0], applied.env);
        }
      } else if (callable instanceof MethodCall) {
        const [object, ...args] = values;
        returnValue(invokeMethod(callable, frame.env, object, args));
      } else if (typeof callable === "function") {
        returnValue(invokeFunction(callable, frame.env, values));
      } else {
        throw new Error(`${callable} is not callable`);
      }
      continue;
    }

    if (frame.type === "cond") {
      if (frame.waitingForCondition) {
        if (result) {
          evaluateNext(frame.expression, frame.env);
        } else {
          frames.push({ ...frame, index: frame.index + 1, waitingForCondition: false });
          returnValue(undefined);
        }
      } else if (frame.index >= frame.pairs.length) {
        returnValue(undefined);
      } else {
        const pair = frame.pairs[frame.index];
        if (pair.length === 1) {
          evaluateNext(pair[0], frame.env);
        } else {
          frames.push({
            ...frame,
            waitingForCondition: true,
            condition: pair[0],
            expression: pair[1]
          });
          evaluateNext(pair[0], frame.env);
        }
      }
      continue;
    }

    if (frame.type === "operator") {
      if (frame.index > 0) {
        frame.values.push(result);
        if (frame.name === "and" && !result) {
          returnValue(false);
          continue;
        }
        if (frame.name === "or" && result) {
          returnValue(result);
          continue;
        }
      }

      if (frame.index < frame.args.length) {
        frames.push({ ...frame, index: frame.index + 1 });
        evaluateNext(frame.args[frame.index], frame.env);
        continue;
      }

      if (frame.name === "not") {
        returnValue(!frame.values[0]);
      } else if (frame.name === "and") {
        returnValue(true);
      } else if (frame.name === "or") {
        returnValue(false);
      } else if (frame.name === "-" && frame.values.length === 1) {
        returnValue(-frame.values[0]);
      } else if (comparisonOperators.has(frame.name)) {
        const operator = binaryOperators[frame.name];
        returnValue(frame.values.slice(1).every((value, index) => operator(frame.values[index], value)));
      } else {
        returnValue(frame.values.reduce(binaryOperators[frame.name]));
      }
      continue;
    }

    if (frame.type === "map") {
      frame.values.push(result);
      const entryIndex = Math.floor(frame.values.length / 2);
      const readingValue = frame.values.length % 2 === 1;

      if (entryIndex >= frame.entries.length) {
        const map = new Map();
        for (let index = 0; index < frame.values.length; index += 2) {
          map.set(frame.values[index], frame.values[index + 1]);
        }
        returnValue(map);
      } else {
        frames.push(frame);
        evaluateNext(frame.entries[entryIndex][readingValue ? 1 : 0], frame.env);
      }
    }
  }

  return result;
}

export default function evaluateIterative(exprs, env) {
  let result;
  for (const expr of exprs) {
    result = evaluateExpressionIterative(expr, env);
  }
  return result;
}
