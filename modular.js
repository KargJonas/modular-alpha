"use strict";
// Jonas Karg 2018

// 
// Core
const modular = {
    // Hiding and unhiding the entire page
    hideContent: () => document.documentElement.style.display = "none",
    showContent: () => document.documentElement.style.display = "block",

    // Convert values render-property content to element
    toHtml: (str, props) => {
        if (typeof str === "function") {
            str = str(props || {});
        }

        if (typeof str === "string") {
            modular.wrapper.innerHTML = str;
            return modular.wrapper.firstChild;

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
        let error;

        if (pos) {
            error = `Modular Error: ${msg}\n--> @ ${pos}`;
        } else {
            error = `Modular Error: ${msg}`;
        }

        return error;
    },

    warn: (msg, pos) => {
        let warning;

        if (pos) {
            warning = `Modular Warning/Info: ${msg}\n--> @ ${pos}`;
        } else {
            warning = `Modular Warning/Info: ${msg}`;
        }

        return warning;
    },

    // Evalates everything between "{{" and "}}"
    parse: context => {
        const text = context.toString().split("{{");
        let result = text.shift();

        for (const part of text) {
            let [key, rest, overflow] = part.split("}}");

            if (!key || rest == undefined || overflow) {
                throw modular.err(`Insert-Delimiters "{{" and "}}" do not match.`, "parse()");
            }

            key = eval(key.trim());
            key = modular.parse(key);
            result += (key + rest);
        }

        return result;
    },

    time: () => {
        console.warn(modular.warn(`Modular info: ${new Date() - modular.initDate}ms`, "time()"));
    },

    render: (components, context) => {
        if (components) {
            for (const component of components) {
                let instances = context.getElementsByTagName(component.conf.name);

                for (let i = instances.length - 1; i >= 0; i--) {
                    component.rendered = modular.toHtml(component.conf.render, modular.elemToObj(instances[i], component.conf.props));
                    modular.componentRender(component);
                    component.rendered.css(component.conf.css);
                    instances[i].outerHTML = component.rendered.outerHTML;
                }
            }
        }
    },

    componentRender: (component) => {
        let compList = [];

        modular.components.map(comp => {
            if (component.rendered.getElementsByTagName(comp.name)) {
                compList.push(comp);
            }
        });

        modular.render(compList, component.rendered);
    },

    getRouter: () => {
        let router = modular.initialDocument.getElementsByTagName("router");
        if (router.length > 1) {
            throw modular.err("To many routers", "render");

        } else if (router.length === 1) {
            router = router[0];
            modular.router.element = document.getElementsByTagName("router")[0];
            modular.router.base = router.getAttribute("base");
            let pages = Array.from(router.getElementsByTagName("page"));
            let redirects = Array.from(router.getElementsByTagName("redirect"));

            if (!modular.router.base) {
                modular.router.base = "";
            }

            pages.map(page => {
                // !! need different handeling for 404/notfound page
                let paths = page.getAttribute("path").replace(/\/$/, "").split("||");
                paths.map(path => {
                    modular.router.pages[modular.router.base + path.trim()] = page.innerHTML.trim();
                });
            });

            redirects.map(redi => {
                // !! need different handeling for 404/notfound page
                let from = redi.getAttribute("from").replace(/\/$/, "");
                let to = redi.getAttribute("to").replace(/\/$/, "");
                modular.router.redirects[modular.router.base + from] = modular.router.base + to;
            });
        }
    },

    routerEvent: () => {
        modular.router.route = window.location.pathname.replace(/\/$/, "");

        let redirect = modular.router.redirects[modular.router.route];
        if (redirect) {
            modular.router.route = redirect;
            window.requestAnimationFrame(modular.routerEvent);

        } else {
            modular.router.content = modular.router.pages[modular.router.route];
            if (modular.router.content) {
                modular.router.element.innerHTML = modular.router.content;

            } else {
                console.warn(modular.warn("Page not found, using default /404 page.", "routerEvent()"));
                modular.router.route = modular.router.base + "/404";
                modular.router.pages[modular.router.base + "/404"] = `<h1>404: Page not Found</h1>`;
                modular.router.content = modular.router.pages[modular.router.base + "/404"];
            }
        }

        window.history.pushState({}, modular.router.route, modular.router.route);
        modular.router.element.innerHTML = modular.router.content;
    },

    router: {
        element: undefined,
        route: undefined,
        content: undefined,
        base: undefined,
        pages: {},
        redirects: {}
    },
    components: [],
    wrapper: document.createElement("div"),
    initialDocument: undefined,
    initDate: new Date()
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
    modular.wrapper.innerHTML = this;
    return modular.wrapper.firstChild;
}

// 
// Instantly executed
modular.hideContent();
modular.initialDocument = document.documentElement;

// 
// OnLoad event
window.addEventListener("load", () => {
    modular.showContent();
});

// 
// The module class
class Module {
    constructor(conf) {
        if (typeof conf === "object") {
            if (conf.render && conf.name) {
                this.conf = conf;
                modular.components.push(this);
            } else throw modular.err("Missing inputs", "new Module()");
        } else throw modular.err("Invalid input\n--> Must be of type [object]", "new Module()");
    }
}

// 
// Renders the elements passed in with the values of the corresponding tags
// ( in the main html-file or other components )
function render(components) {
    modular.getRouter();
    modular.router.route = window.location.pathname.replace(/\/$/, "");
    if (modular.router.element) {
        modular.routerEvent();
    }
    modular.render(components, modular.initialDocument);
    document.documentElement.innerHTML = modular.parse(modular.initialDocument.innerHTML);
}