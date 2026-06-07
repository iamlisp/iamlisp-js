import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  completionItems,
  findDocumentSymbols,
  hoverForWord,
  validateDocument,
  wordAt
} from "./analysis";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    completionProvider: { triggerCharacters: ["(", " "] },
    documentSymbolProvider: true,
    hoverProvider: true
  },
  serverInfo: {
    name: "iamlisp-lsp"
  }
}));

function publishDiagnostics(document) {
  connection.sendDiagnostics({
    uri: document.uri,
    diagnostics: validateDocument(document.getText())
  });
}

documents.onDidOpen(event => publishDiagnostics(event.document));
documents.onDidChangeContent(event => publishDiagnostics(event.document));
documents.onDidClose(event => {
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

connection.onCompletion(completionItems);
connection.onDocumentSymbol(params => {
  const document = documents.get(params.textDocument.uri);
  return document ? findDocumentSymbols(document.getText()) : [];
});
connection.onHover(params => {
  const document = documents.get(params.textDocument.uri);
  return document
    ? hoverForWord(wordAt(document.getText(), params.position))
    : null;
});

documents.listen(connection);
connection.listen();
