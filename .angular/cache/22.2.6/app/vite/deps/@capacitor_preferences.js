import { registerPlugin } from "./@capacitor_core.js";
// node_modules/@capacitor/preferences/dist/esm/index.js
var Preferences = registerPlugin("Preferences", { web: () => import("./web-BOM5XDUj.js").then((m) => new m.PreferencesWeb()) });
export { Preferences };
