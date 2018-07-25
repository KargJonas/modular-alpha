// Modular v2
// Jonas Karg 2018
"use strict";

// 
// core
const modular = {
    // hiding/unhiding the entire page
    hideContent: () => document.documentElement.style.display = "none",
    showContent: () => document.documentElement.style.display = "block",

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

    // convert an elements attributes into an object
    elemToObj(elem) {
        let obj = {};

        Array.from(elem.attributes).map(attr => {
            let val = attr.value.trim();
            if (/{[^{}\n]*}/.test(val)) val = eval(val.slice(1, -1));
            obj[attr.name] = val;
        });

        return obj;
    },

    // Transforms all custom tags into divs with classes and pushes them into the "instances"-array in th corresponding component
    getInstances(context) {
        Object.entries(modular.components).map(entry => {
            const component = entry[1];
            component.__data.instances = Array.from(context.getElementsByTagName(component.tag));;

            component.__data.instances.map(instance => {
                const newElement = document.createElement("div");
                Array.from(instance.attributes).map(attribute => newElement.setAttribute(attribute.name, attribute.value));
                newElement.setAttribute("data-modular-id", component.tag);
                newElement.classList.add("__component__");
                // newElement.innerHTML = instance.innerHTML;
                instance.outerHTML = newElement.outerHTML;
            });
        });
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
            return `${selector} ${el[0]}{${el[1]}}`;
        }).join(" ");
    },

    applyStyles() {        
        Object.entries(modular.components).map(entry => {
            const component = entry[1];
            const selector = `div[data-modular-id="${component.tag}"]`;

            if (component.css) {
                modular.styleTag.innerHTML += modular.globalCSS(selector, component.css);
            }
        });
    },

    // replaces Module-instances with the module's rendered content
    renderContext(context) {
        modular.getInstances(context);
        let instances = Array.from(context.getElementsByClassName("__component__"));

        instances.map(instance => {
            const component = modular.components[instance.getAttribute("data-modular-id")];
            modular.tempEl.push("");
            component.rendered = component.render(Object.assign(component.props, modular.elemToObj(instance) || {}));
            modular.tempEl.pop();
            instance.innerHTML = component.rendered;
            modular.renderContext(instance)
        });
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

    time() {
        console.warn(modular.info(
            `(${performance.now() - modular.initPerf}ms)`,
            "modular.time()"));
    },

    // variables
    components: {},
    tempEl: [],
    styleTag: document.createElement("style"),
    scriptTag: document.createElement("script"),
    plugins: [],
    initPerf: performance.now(),
    onRender: new Event("onRender"),
    afterRender: new Event("afterRender"),
    onInit: new Event("onInit"),
    afterInit: new Event("afterInit")
};

// 
// instantly executed
window.dispatchEvent(modular.onInit);
modular.hideContent();
modular.scriptTag.setAttribute("onload", "this.remove();");
document.head.appendChild(modular.styleTag);
window.dispatchEvent(modular.afterInit);

// 
// load event
window.addEventListener("load", () => modular.showContent());

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
        this.__data = {};
        this.__data.instances = [];
        modular.components[this.tag] = this;
        // modular.components.push(this);
    }
}

// 
// renders the documentElement
function render() {
    window.dispatchEvent(modular.onRender);
    modular.renderContext(document.documentElement);
    modular.applyStyles();
    window.dispatchEvent(modular.afterRender);
}

// 
// simplifies working with conditions, loops and such in render
function el() {
    let str = "";
    Array.from(arguments).map(attr => str += attr);
    modular.tempEl[modular.tempEl.length - 1] += str;
    return modular.tempEl[modular.tempEl.length - 1];
}