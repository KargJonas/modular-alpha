// Modular Prebuilt Components
// Jonas Karg 2018
"use strict";

if (typeof modular !== "object") throw new Error("(Modular-Plugin):\n--> Modular not found.\n--> Modular is required for plugins to work.");

modular.addPlugin({
    name: "prebuilt_components",
    version: "0.1",

    onInit() {
        let _modular_prebuilt = new Component({
            tag: "mp-green-btn",

            render(props) {
                el(`<button type="button">${props.text}</button>`);
                return el();
            },

            css: {
                "button": {
                    border: "none",
                    borderRadius: "7px",
                    backgroundColor: "#4e7",
                    padding: "4px",
                    color: "#fff",
                    outline: "none",
                    userSelect: "none",
                    cursor: "pointer"
                },

                "button:hover": {
                    color: "#4e7",
                    backgroundColor: "transparent",
                    border: "2px solid #4e7"
                }
            }
        });
    }
});