// Jonas Karg 2018
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
window.addEventListener("load", function () {
    if ((typeof modular === "undefined" ? "undefined" : _typeof(modular)) === "object") {
        var routerNavigate = function routerNavigate(page) {
            modular.router.route = modular.router.base + page;
            window.history.pushState(null, null, modular.router.route);
            modular.router.routerEvent();
        };
        modular.router = {
            exists: false,
            element: undefined,
            route: undefined,
            content: undefined,
            base: undefined,
            pages: {},
            redirects: {},
            getRouter: function getRouter() {
                var router = document.getElementsByTagName("router");
                if (router.length > 1) {
                    throw modular.err("More than one \"router\"-tag found.", "Only one \"router\"-tag allowed.", "@ modular.getRouter()");
                } else if (router.length === 1) {
                    router = router[0];
                    var pages = Array.from(router.getElementsByTagName("page"));
                    var redirects = Array.from(router.getElementsByTagName("redirect"));
                    var links = Array.from(document.getElementsByTagName("router-link"));

                    modular.router.exists = true;
                    modular.router.base = router.getAttribute("base");

                    if (!modular.router.base) modular.router.base = "";

                    modular.router.pages[modular.router.base + "/404"] = "<h1>404: Page not Found</h1>";

                    pages.map(function (page) {
                        var paths = page.getAttribute("path").replace(/\/$/, "").split("||");
                        paths.map(function (path) {
                            modular.router.pages[modular.router.base + path.trim()] = page.innerHTML.trim();
                        });
                    });

                    redirects.map(function (redirect) {
                        var from = redirect.getAttribute("from").replace(/\/$/, "");
                        var to = redirect.getAttribute("to").replace(/\/$/, "");
                        modular.router.redirects[modular.router.base + from] = modular.router.base + to;
                    });

                    links.map(function (link) {
                        var to = link.getAttribute("to").replace(/\/$/, "");
                        link.setAttribute("onclick", "routerNavigate(\"" + to + "\")");
                        link.style = "color: #00e; text-decoration: underline; cursor: pointer;";
                    });
                }
            },
            routerEvent: function routerEvent() {
                if (modular.router) {
                    modular.router.route = window.location.pathname.replace(/\/$/, "");
                    var redirect = modular.router.redirects[modular.router.route];

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
                    renderAll();
                }
            }
        };
        modular.router.getRouter();
        if (modular.router.exists) modular.router.routerEvent();
    } else throw new Error("(Modular-Router):\n--> Modular not found.\n--> Modular is required for Modular-Router to work.\n");
});