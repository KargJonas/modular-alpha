// Modular Router
// Jonas Karg 2018
"use strict";

if (typeof modular !== "object") throw new Error("(Modular-Plugin):\n--> Modular not found.\n--> Modular is required for plugins to work.");

modular.addPlugin({
    name: "router",
    version: "1.0",

    onInit() {
        modular.router = {
            exists: false,
            element: undefined,
            route: undefined,
            content: undefined,
            base: undefined,
            pages: {},
            redirects: {},

            // registers the structure of a router-tag
            getRouter() {
                modular.plugins.map(plugin => {
                    if (plugin["onGetRouter"]) plugin.onGetRouter();
                });

                let router = document.getElementsByTagName("router");
                if (router.length > 1) {
                    throw modular.err(
                        `More than one "router"-tag found.`,
                        `Only one "router"-tag allowed.`,
                        "@ modular.getRouter()");

                } else if (router.length === 1) {
                    router = router[0];
                    let pages = Array.from(router.getElementsByTagName("page"));
                    let redirects = Array.from(router.getElementsByTagName("redirect"));
                    let links = Array.from(document.getElementsByTagName("router-link"));

                    modular.router.exists = true;
                    modular.router.base = router.getAttribute("base");

                    if (!modular.router.base) modular.router.base = "";

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
                }
            },

            // updates the router if existing
            routerEvent() {
                modular.plugins.map(plugin => {
                    if (plugin["onRouterEvent"]) plugin.onRouterEvent();
                });

                if (modular.router) {
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
            }
        };

        function routerNavigate(page) {
            modular.router.route = modular.router.base + page;
            window.history.pushState(null, null, modular.router.route);
            modular.router.routerEvent();
        }

        // modular.router.getRouter();
        // if (modular.router.exists) modular.router.routerEvent();
    }
});