// Jonas Karg 2018
"use strict";

// 
// Core
const _modularCore = {
    // Hiding and unhiding the entire page
    hideContent: () => document.documentElement.style.display = "none",
    showContent: () => document.documentElement.style.display = "block",

    // Convert values render-property content to element
    toHtml: (str, props) => {
        if (typeof str === "function") {
            str = str(props || {});
        }

        if (typeof str === "string") {
            _modularCore.wrapper.innerHTML = str;
            return _modularCore.wrapper.firstChild;

        } else return str;
    },

    // Convert an elements attributes to a object
    elemToObj: elem => {
        let obj = {};

        Array.from(elem.attributes).map(attr => {
            obj[attr.name] = attr.value
        });

        return obj;
    },

    // Throw an error
    err: (msg, pos) => {
        if (pos) {
            console.error(`( Modular ) ERROR: ${msg} @ ${pos}`);
        } else {
            console.error(`( Modular ) ERROR: ${msg}`);
        }

        return false;
    },

    // Evalates everything between "{{" and "}}"
    parse: (context) => {
        const text = context.toString().split("{{");
        let result = text.shift();

        for (const part of text) {
            let [key, rest, overflow] = part.split("}}");

            if (!key || rest == undefined || overflow) {
                return _modularCore.err(`Insert-Delimiters "{{" and "}}" do not match.`, "parse()");
            }

            key = eval(key.trim());
            key = _modularCore.parse(key);
            result += (key + rest);
        }

        return result;
    },

    // A invisible wrapper element used to convert strings to html
    wrapper: document.createElement("div"),
};

// 
// Set CSS
Element.prototype.css = function (css) {
    if (typeof css === "string") {
        this.setAttribute("style", css.replace(/\s+/g, ' ').trim());

    } else if (typeof css === "object") {
        Object.assign(this.style, css);
    }
};

// 
// Hide Element
Element.prototype.hide = function () {
    this.style.display = "none";
};

// 
// Show Element
Element.prototype.show = function () {
    this.style.display = "block";
};

// 
// Convert string to html element
String.prototype.toHtml = function () {
    _modularCore.wrapper.innerHTML = this;
    return _modularCore.wrapper.firstChild;
}

// 
// OnLoad event
window.addEventListener("load", () => {
    document.documentElement.innerHTML = _modularCore.parse(document.documentElement.innerHTML);
    _modularCore.showContent();
});

// 
// Create a component
function create(conf) {
    if (typeof conf === "object") {
        if (conf.render && conf.name) {
            let component;
            component = _modularCore.toHtml(conf.render, conf.props);
            component.conf = conf;

            if (component.conf.hide) {
                component.hide();

            } else component.show();

            // component.setAttribute("onmouseenter", "console.log(this.conf)");

            component.css(component.conf.css);
            return component;

        } else return _modularCore.err("Missing attribute(s)", "create()");
    } else return _modularCore.err("Invalid input", "create()");
}

// 
// Renders the elements passed in with the values of the corresponding tags
// ( in the main html-file or other components )
function render(components) {
    for (const component of components) {
        let instances = document.getElementsByTagName(component.conf.name);

        for (let i = instances.length - 1; i >= 0; i--) {
            let renderedComp = _modularCore.toHtml(component.conf.render, Object.assign(_modularCore.elemToObj(instances[i]), component.conf.props));
            renderedComp.css(component.conf.css)
            instances[i].outerHTML = renderedComp.outerHTML;
        }
    }
}

// 
// Hide all content ( unhidden after averything is done )
_modularCore.hideContent();
_modularCore.wrapper.hide();
document.body.appendChild(_modularCore.wrapper);