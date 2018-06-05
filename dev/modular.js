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
            if (modular.wrapper.children.length > 1) {
                throw modular.err("Only one element allowed in render!\n--> If you want to render multiple elements, put them in a div.", "modular.toHtml()");
            }
            return modular.wrapper.firstChild;

        } else return str;
    },

    // Convert an elements attributes into an object
    elemToObj: elem => {
        let obj = {};

        Array.from(elem.attributes).map(attr => {
            obj[attr.name] = attr.value;
        });

        return obj;
    },

    transformStyleObj: obj => {
        let res = [];

        Object.entries(obj).map(entry => {
            Object.assign(modular.wrapper.style, entry[1]);
            entry[1] = modular.wrapper.getAttribute("style");
            res.push(entry);
        });

        modular.wrapper.style = "";
        return res;
    },

    // Throw an error
    err: (msg, pos) => {
        let error = `Modular Error: ${msg}`;
        return (pos ? `${error}\n--> @ ${pos}` : error);
    },

    warn: (msg, pos) => {
        let warning = `Modular Warning/Info: ${msg}`;
        return (pos ? `${warning}\n--> @ ${pos}` : warning);
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

    render: (context) => {
        let components = [];

        modular.components.map(comp => {
            if (context.getElementsByTagName(comp.name)[0]) {
                components.push(comp);
            }
        });

        if (components) {
            for (const component of components) {
                let instances = context.getElementsByTagName(component.name);
                let css = [];

                component.className = `_modular_${component.name}`;

                if (component.css) {
                    css = modular.transformStyleObj(component.css);
                    css.map(el => {
                        modular.documentStyle.innerHTML += `.${component.className} > ${el[0]} {${el[1]}}`;
                    });
                }

                for (let i = instances.length - 1; i >= 0; i--) {
                    component.rendered = modular.toHtml(component.render, Object.assign(component.props, modular.elemToObj(instances[i]) || {}));
                    component.rendered.classList.add(component.className);
                    modular.render(component.rendered);
                    instances[i].outerHTML = component.rendered.outerHTML;
                }
            }
        }
    },

    getRouter: () => {
        let router = document.getElementsByTagName("router");
        if (router.length > 1) {
            throw modular.err("More than one router found", "render");

        } else if (router.length === 1) {
            modular.router.exists = true;
            router = router[0];
            modular.router.base = router.getAttribute("base");
            let pages = Array.from(router.getElementsByTagName("page"));
            let redirects = Array.from(router.getElementsByTagName("redirect"));
            let links = Array.from(document.getElementsByTagName("router-link"));

            if (!modular.router.base) {
                modular.router.base = "";
            }

            modular.router.pages[modular.router.base + "/404"] = "<h1>404: Page not Found</h1>";

            pages.map(page => {
                let paths = page.getAttribute("path").replace(/\/$/, "").split("||");
                paths.map(path => {
                    modular.router.pages[modular.router.base + path.trim()] = page.innerHTML.trim();
                });
            });

            redirects.map(redirect => {
                let from = redirect.getAttribute("from").replace(/\/$/, "");
                let to = redirect.getAttribute("to").replace(/\/$/, "");
                modular.router.redirects[modular.router.base + from] = modular.router.base + to;
            });


            links.map(link => {
                let to = link.getAttribute("to").replace(/\/$/, "");
                link.setAttribute("onclick", `routerNavigate("${to}")`);
                link.style = "color: #00e; text-decoration: underline; cursor: pointer;";
            });

            // window.addEventListener("popstate", () => {
            //     modular.routerEvent();
            // });
        }
    },

    routerEvent: () => {
        if (modular.router.exists) {
            modular.router.route = window.location.pathname.replace(/\/$/, "");
            let redirect = modular.router.redirects[modular.router.route];

            if (redirect) {
                routerNavigate(redirect.slice(modular.router.base.length));

            } else {
                modular.router.content = modular.router.pages[modular.router.route];
                if (!modular.router.content) {
                    modular.router.route = modular.router.base + "/404";
                    modular.router.content = modular.router.pages[modular.router.base + "/404"];
                }
            }

            window.history.pushState(null, null, modular.router.route);
            render();
        }
    },

    router: {
        exists: false,
        element: undefined,
        route: undefined,
        content: undefined,
        base: undefined,
        pages: {},
        redirects: {}
    },
    components: [],
    documentStyle: document.createElement("style"),
    wrapper: document.createElement("div"),
    initialDocument: undefined,
    initDate: new Date()
};

// 
// Instantly executed
modular.hideContent();
modular.initialDocument = document.documentElement.cloneNode(true);
modular.getRouter();

// 
// OnLoad event
window.addEventListener("load", () => {
    modular.routerEvent();
    modular.showContent();
    modular.time();
});

// 
// The module class
class Module {
    constructor(conf) {
        if (typeof conf === "object") {
            if (conf.render && conf.name) {
                Object.assign(this, conf);
                this.props = (conf.props ? conf.props : {});
                modular.components.push(this);

            } else throw modular.err("Missing inputs", "new Module()");
        } else throw modular.err(`Invalid input\n--> Must be of type "object"`, "new Module()");
    }
}

// 
// Renders and parses everything
function render() {
    modular.documentStyle.innerHTML = "";
    if (modular.router.exists) {
        document.getElementsByTagName("router")[0].innerHTML = modular.router.content;
    }
    modular.render(document.documentElement);
    document.documentElement.innerHTML = modular.parse(document.documentElement.innerHTML);
    document.head.appendChild(modular.documentStyle);
}

// 
// Navigates the router to the provided url
function routerNavigate(page) {
    modular.router.route = modular.router.base + page;
    window.history.pushState(null, null, modular.router.route);
    modular.routerEvent();
}