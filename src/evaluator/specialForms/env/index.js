import def from "./def";
import defa from "./defa";
import set from "./set";
import seta from "./seta";

const envForms = { def, "set!": set, "def*": defa, "*set!": seta };

export default envForms;
