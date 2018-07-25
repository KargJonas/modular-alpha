// Modular v2
// Jonas Karg 2018
"use strict";

// 
// core
const modular = {
    // hiding/unhiding the entire page
    hideContent: () => document.documentElement.style.display = "none",
    showContent: () => document.documentElement.style.display = "block",

    // convert an elements attributes into an object
    elemToObj(elem) {
        let obj = {};

        Array.from(elem.attributes).map(attr => {
            let val = attr.value.trim();
            if (val.startsWith("{{") && val.endsWith("}}")) val = eval(val.slice(2, -2).trim());
            obj[attr.name] = val;
        });

        return obj;
    },

    // transform style-object ( css: { .. } ) to global CSS
    globalCSS(selector, obj) {
        let res = [];
        let wrapper = document.createElement("div");

        Object.entries(obj).map(entry => {
            if (typeof entry[1] !== "string") {
                Object.assign(wrapper.style, entry[1]);
                entry[1] = wrapper.getAttribute("style");
            }
            res.push(entry);
        });

        return res.map(el => {
            return `.${selector} ${el[0]} {${el[1]}} `;
        });
    },

    // returns an error-string
    err() {
        let args = Array.from(arguments);
        let error = "(Modular):\n";
        for (let i = 0; i < arguments.length - 1; i++) error += `--> ${args[i]}\n`;
        error += `\n--> @ ${args[args.length - 1]}`;

        return new Error(error);
    },

    info() {
        let args = Array.from(arguments);
        let inf = "Info: (Modular):\n";
        for (let i = 0; i < arguments.length - 1; i++) inf += `--> ${args[i]}\n`;
        inf += `\n--> @ ${args[args.length - 1]}`;

        return inf;
    },

    // evaluates everything between "{{" and "}}" in a given string
    parse(htmlContext, jsContext) {
        const text = htmlContext.toString().split("{{");
        let result = text.shift();

        for (const part of text) {
            let [key, rest, overflow] = part.split("}}");
            if (!key || rest == undefined || overflow) throw modular.err(
                `Insert-Delimiters "{{" and "}}" do not match.`,
                "modular.parse()");

            key = function (keyStr) {
                return eval(keyStr);
            }.call(jsContext, key.trim());
            key = modular.parse(key);
            result += (key + rest);
        }

        return result;
    },

    // replaces Module-instances with the module's rendered content
    renderInContext(context) {
        let components = [];

        modular.components.map(comp => {
            if (context.getElementsByTagName(comp.tag)[0]) components.push(comp);
        });

        if (!components) return;

        for (const component of components) {
            let instances = Array.from(context.getElementsByTagName(component.tag));
            instances.map(instance => {
                let ifAttribute = instance.getAttribute("m-if");
                if (ifAttribute) {
                    ifAttribute = eval(ifAttribute);
                    instance.removeAttribute("m-if");

                } else ifAttribute = true;

                if (ifAttribute) {
                    if (typeof component.render !== "function") throw modular.err(
                        "Mod.render must be a function.",
                        "modular.toHtml()");

                    modular.tempEl.push("");
                    component.rendered = component.render(Object.assign(component.props, modular.elemToObj(instance) || {}));
                    modular.tempEl.pop();

                    if (!component.rendered) throw modular.err(
                        `"render()" must return a value.`,
                        "modular.toHtml()");

                    if (typeof component.rendered !== "string") throw modular.err(
                        `A Modules "render"-function must return a string.`,
                        "modular.toHtml()");

                    let wrapper = document.createElement("div");
                    wrapper.innerHTML = component.rendered;
                    wrapper.classList.add(component.className);
                    wrapper.classList.add("_component_");
                    modular.renderInContext(wrapper);
                    instance.outerHTML = wrapper.outerHTML;

                } else instance.outerHTML = "";
            });

            modular.documentStyle.innerHTML += component.transformedCss;
        }
        document.head.appendChild(modular.documentStyle);
    },

    addPlugin(plugin) {
        if (!plugin.name) throw modular.err(
            `Invalid plugin.`,
            `A plugin must be of type "object".`,
            `A plugin must have a "name"-attribute`,
            `addPlugin()`);

        modular.plugins.map(pl => {
            if (pl.name == plugin.name) throw modular.err(
                `Duplicate plugin: "${plugin.name}".`,
                "addPlugin()");
        });

        plugin._pluginInit_ = performance.now() - modular.initPerf;
        modular.plugins.push(plugin);
        if (plugin.onInit) plugin.onInit();
    },

    checkPlugin(pluginName, log) {
        let isLoaded = false;

        modular.plugins.map(pl => {
            if (pl.name == pluginName) isLoaded = true;
        });

        if (log) {
            console.warn(modular.info(
                `${isLoaded ? "Plugin loaded." : "Plugin not loaded."}`,
                "modular.checkPlugin()"));
        }

        return isLoaded;
    },

    loadScripts(srcs, callback) {
        if (srcs.constructor !== Array) throw modular.err(`"loadScrips()" expects an array.`,
            "modular.loadScripts()");

        srcs.map(src => {
            if (!src.endsWith(".js")) throw modular.err(`"loadScripts()" can only load ".js"-files.`,
                "modular.loadScripts()");

            modular.scriptTag.src = src;
            document.head.appendChild(modular.scriptTag);
        });

        if (callback) callback();
    },

    time() {
        console.warn(modular.info(
            `(${performance.now() - modular.initPerf}ms)`,
            "modular.time()"));
    },

    // variables
    components: [],
    tempEl: [],
    documentStyle: document.createElement("style"),
    scriptTag: document.createElement("script"),
    initialDocument: undefined,
    plugins: [],
    initPerf: performance.now()
};

// 
// instantly executed
modular.hideContent();
modular.initialDocument = document.documentElement.cloneNode(true);
modular.scriptTag.setAttribute("onload", "this.remove();");

// 
// load event
window.addEventListener("load", () => {
    modular.showContent();
    modular.plugins.map(plugin => {
        if (plugin["onLoad"]) plugin.onLoad();
    });
});

// 
// the module class
class Component {
    constructor(conf) {
        if (typeof conf !== "object") throw modular.err(
            "Invalid Module-configuration.",
            `Configuration must be of type "object."`,
            "new Module()");

        if (!conf.render || !conf.tag) throw modular.err(
            "Missing attributes.",
            `The attributes "tag" and "render()" are required.`,
            "new Module()");

        Object.assign(this, conf);
        this.props = (conf.props ? conf.props : {});
        this.className = `_component_${this.tag}`;

        if (this.css) this.transformedCss = modular.globalCSS(this.className, this.css);
        else this.transformedCss = "";

        modular.components.push(this);
    }
}

// 
// renders and parses everything
function render() {
    modular.plugins.map(plugin => {
        if (plugin["onRender"]) plugin.onRender();
    });

    modular.documentStyle.innerHTML = "";
    document.documentElement.innerHTML = modular.initialDocument.innerHTML;

    if (modular.router && modular.router.exists) document.getElementsByTagName("router")[0].innerHTML = modular.router.content;
    modular.renderInContext(document.documentElement);
    document.documentElement.innerHTML = modular.parse(document.documentElement.innerHTML, window);

    modular.plugins.map(plugin => {
        if (plugin["renderDone"]) plugin.renderDone();
    });
}

// 
// simplifies working with conditions, loops and such in render
function el() {
    let str = "";
    Array.from(arguments).map(attr => str += attr);
    modular.tempEl[modular.tempEl.length - 1] += str;
    return modular.tempEl[modular.tempEl.length - 1];
}