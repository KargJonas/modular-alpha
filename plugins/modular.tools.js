// Modular Development Tools
// Jonas Karg 2018
"use strict";

if (typeof modular !== "object") throw new Error("(Modular-Plugin):\n--> Modular not found.\n--> Modular is required for plugins to work.");

// Adding the plugin
modular.addPlugin({
    name: "dev_tools",
    version: "0.2",

    onInit() {
        modular.tools = {};
        modular.tools.compHighStyle = document.createElement("style");
        modular.tools.compHighStyle.innerHTML = "._component_ {box-shadow: 0 0 2px #a00}";

        if (!sessionStorage["compHigh"]) {
            sessionStorage.compHigh = "false";
        } else if (sessionStorage.compHigh === "true") document.head.appendChild(modular.tools.compHighStyle);

        modular.highlightToggle = () => {
            if (sessionStorage.compHigh === "true") {
                sessionStorage.compHigh = "false";
            } else sessionStorage.compHigh = "true";

            if (sessionStorage.compHigh === "true") {
                document.head.appendChild(modular.tools.compHighStyle);
            } else modular.tools.compHighStyle.remove();
        };

        modular.listPlugins = () => {
            let tree = "";

            modular.plugins.map(plugin => {
                tree += `\n  └─> ${plugin.name}${plugin.version ? ` (v${plugin.version})` : ""} (${plugin._pluginInit_.toFixed(2)}ms)`;
            });

            console.warn(modular.info(
                `List of plugins currently active:\n  |${tree ? tree : "  └─> (none)"}`,
                "modular.listPlugins()"));
        };
    },

    renderDone() {
        if (sessionStorage.compHigh === "true") document.head.appendChild(modular.tools.compHighStyle);
    }
});