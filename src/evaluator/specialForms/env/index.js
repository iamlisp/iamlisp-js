import def from "./def";
import defa from "./defa";
import set from "./set";
import seta from "./seta";
import where from "./where";

const envForms = { def, "set!": set, "def*": defa, "*set!": seta, where };

export default envForms;
