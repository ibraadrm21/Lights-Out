import { React, ReactDOM, html } from "/src/utils/htm.js";
import App from "/src/App.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
