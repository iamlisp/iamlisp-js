import list from "./list";
import prepend from "./prepend";
import head from "./head";
import tail from "./tail";

const listForms = { list, "+:": prepend, head, tail };

export default listForms;
