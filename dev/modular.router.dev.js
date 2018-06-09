// Jonas Karg 2018

window.addEventListener("load", () => {
    if (typeof modular === "object") {
        if (modular.router) throw modular.err("Modular-Router already included.", "@ window.addEventListener()"); 
        // Adding router-functionality to modular
        modular.router = {
            exists: false,
            element: undefined,
            route: undefined,
            content: undefined,
            base: undefined,
            pages: {},
            redirects: {},

            // registers the structure of a router-tag
            getRouter: () => {
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
            routerEvent: () => {
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
                    renderAll();
                }
            }
        };

        // 
        // navigates the router to the provided url
        function routerNavigate(page) {
            modular.router.route = modular.router.base + page;
            window.history.pushState(null, null, modular.router.route);
            modular.router.routerEvent();
        }

        modular.router.getRouter();
        if (modular.router.exists) modular.router.routerEvent();

    } else throw new Error("(Modular-Router):\n--> Modular not found.\n--> Modular is required for Modular-Router to work.\n@ window.addEventListener()");
});