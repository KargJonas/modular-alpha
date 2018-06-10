// Jonas Karg 2018
"use strict";

// used for testing
console.time();

// 
// core
const modular = {
    // hiding/unhiding the entire page
    hideContent: () => document.documentElement.style.display = "none",
    showContent: () => document.documentElement.style.display = "block",

    // convert values render-property content to element
    toHtml: (str, props) => {
        if (typeof str === "function") {
            modular.tempEl.push("");
            str = str(props || {});
            modular.tempEl.pop();
            if (!str) throw modular.err(
                `"render()" must return a value.`,
                "@ modular.toHtml()");

            if (typeof str === "string") {
                modular.wrapper.innerHTML = str;
                modular.wrapper.removeAttribute("class");
                return modular.wrapper.cloneNode;

            } else throw modular.err(`A Modules "render"-function must return a string.`, "@ modular.toHtml()");
        } else throw modular.err("Mod.render must be a function.", "@modular.toHtml()");
    },

    // convert an elements attributes into an object
    elemToObj: elem => {
        let obj = {};
        
        Array.from(elem.attributes).map(attr => {
            let val = attr.value.trim();
            if (val.startsWith("{{") && val.endsWith("}}")) val = eval(val.slice(2, -2).trim());
            obj[attr.name] = val;
        });

        return obj;
    },

    // transform style-object ( css: { .. } ) to global CSS
    transformStyleObj: obj => {
        let res = [];

        Object.entries(obj).map(entry => {
            if (typeof entry[1] !== "string") {
                Object.assign(modular.wrapper.style, entry[1]);
                entry[1] = modular.wrapper.getAttribute("style");
            }
            res.push(entry);
            modular.wrapper.removeAttribute("style");
        });

        return res;
    },

    // returns a error-string
    err: function () {
        let args = Array.from(arguments);
        let error = "(Modular):\n";
        args.map(arg => {
            error += `--> ${arg}\n`
        });

        return new Error(error);
    },

    // evaluates everything between "{{" and "}}" in a given string
    parse: context => {
        const text = context.toString().split("{{");
        let result = text.shift();

        for (const part of text) {
            let [key, rest, overflow] = part.split("}}");
            if (!key || rest == undefined || overflow) throw modular.err(
                `Insert-Delimiters "{{" and "}}" do not match.`,
                "@ modular.parse()");

            key = eval(key.trim());
            key = modular.parse(key);
            result += (key + rest);
        }

        return result;
    },

    // replaces Module-instances with the modules rendered content
    render: (context) => {
        let components = [];

        modular.components.map(comp => {
            if (context.getElementsByTagName(comp.name)[0]) components.push(comp);
        });

        if (components) {
            for (const component of components) {
                let instances = context.getElementsByTagName(component.name);
                let css = [];

                component.className = `_modular_${component.name}`;

                if (component.css) {
                    css = modular.transformStyleObj(component.css);

                    css.map(el => {
                        modular.documentStyle.innerHTML += `.${component.className} ${el[0]} {${el[1]}} `;
                    });
                }
                
                for (let i = instances.length - 1; i >= 0; i--) {
                    let ifAttribute = instances[i].getAttribute("m-if");

                    if (ifAttribute) {
                        ifAttribute = eval(ifAttribute);
                        instances[i].removeAttribute("m-if");

                    } else ifAttribute = true;

                    if (ifAttribute) {
                        component.rendered = modular.toHtml(component.render, Object.assign(component.props, modular.elemToObj(instances[i]) || {}));
                        component.rendered.classList.add(component.className);
                        modular.render(component.rendered);
                        instances[i].outerHTML = component.rendered.outerHTML;

                    } else instances[i].outerHTML = "";
                }
            }
        }
    },

    // variables
    components: [],
    tempEl: [],

    documentStyle: document.createElement("style"),
    wrapper: document.createElement("div"),

    initialDocument: undefined
};

// 
// instantly executed
modular.hideContent();
modular.initialDocument = document.documentElement.cloneNode(true);

// 
// load event
window.addEventListener("load", modular.showContent);

// 
// the module class
class Mod {
    constructor(conf) {
        if (typeof conf === "object") {
            if (conf.render && conf.name) {
                Object.assign(this, conf);
                this.props = (conf.props ? conf.props : {});
                modular.components.push(this);

            } else throw modular.err(
                "Missing values.",
                `"name" and "render()" are required.`,
                "new Module()");
        } else throw modular.err(
            "Invalid Module-configuration.",
            `Configuration must be of type "object."`,
            "new Module()");
    }
}

// 
// renders and parses everything
function renderAll() {
    modular.documentStyle.innerHTML = "";
    document.documentElement.innerHTML = modular.initialDocument.innerHTML;
    if (modular.router && modular.router.exists) document.getElementsByTagName("router")[0].innerHTML = modular.router.content;
    modular.render(document.documentElement);
    document.documentElement.innerHTML = modular.parse(document.documentElement.innerHTML);
    document.head.appendChild(modular.documentStyle);
}

// 
// simplifies working with conditions, loops and such in render
function el() {
    let str = "";
    Array.from(arguments).map(attr => {
        str += attr
    });
    modular.tempEl[modular.tempEl.length - 1] += str;

    return modular.tempEl[modular.tempEl.length - 1];
}