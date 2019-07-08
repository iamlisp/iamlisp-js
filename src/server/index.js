import WebSocket from "ws";
import createEvaluator from "../createEvaluator";

let requestId = 0;
const getNextRequestId = () => requestId++;

const PORT = process.env.PORT || 8080;
const EVAL_TIMEOUT = process.env.EVAL_TIMEOUT || 30000;

function startServer() {
  const wss = new WebSocket.Server({ port: PORT });

  wss.on("connection", ws => {
    const printFn = arg => {
      ws.send(JSON.stringify({ print: arg }));
    };

    const evaluate = createEvaluator({
      printFn,
      debug: false,
      timeout: EVAL_TIMEOUT
    });

    ws.on("message", message => {
      const id = getNextRequestId();
      try {
        const result = evaluate(message);
        ws.send(JSON.stringify({ id, result }));
      } catch (e) {
        ws.send(JSON.stringify({ id, error: e.stack }));
      }
    });
  });
}

startServer();
