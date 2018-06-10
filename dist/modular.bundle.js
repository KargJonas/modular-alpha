// Jonas Karg 2018
"use strict";

// used for testing

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 
// core
var modular = {
    // hiding/unhiding the entire page
    hideContent: function hideContent() {
        return document.documentElement.style.display = "none";
    },
    showContent: function showContent() {
        return document.documentElement.style.display = "block";
    },

    // convert values render-property content to element
    toHtml: function toHtml(str, props) {
        if (typeof str === "function") {
            modular.tempEl.push("");
            str = str(props || {});
            modular.tempEl.pop();
            if (!str) throw modular.err("\"render()\" must return a value.", "@ modular.toHtml()");

            if (typeof str === "string") {
                modular.wrapper.innerHTML = str;
                return modular.wrapper;
            } else throw modular.err("A Modules \"render\"-function must return a string.", "@ modular.toHtml()");
        } else throw modular.err("Mod.render must be a function.", "@modular.toHtml()");
    },

    // convert an elements attributes into an object
    elemToObj: function elemToObj(elem) {
        var obj = {};

        Array.from(elem.attributes).map(function (attr) {
            var val = attr.value.trim();
            if (val.startsWith("{{") && val.endsWith("}}")) val = eval(val.slice(2, -2).trim());
            obj[attr.name] = val;
        });

        return obj;
    },

    // transform style-object ( css: { .. } ) to global CSS
    transformStyleObj: function transformStyleObj(obj) {
        var res = [];

        Object.entries(obj).map(function (entry) {
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
    err: function err() {
        var args = Array.from(arguments);
        var error = "(Modular):\n";
        args.map(function (arg) {
            error += "--> " + arg + "\n";
        });

        return new Error(error);
    },

    // evaluates everything between "{{" and "}}" in a given string
    parse: function parse(context) {
        var text = context.toString().split("{{");
        var result = text.shift();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = text[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var part = _step.value;

                var _part$split = part.split("}}"),
                    _part$split2 = _slicedToArray(_part$split, 3),
                    key = _part$split2[0],
                    rest = _part$split2[1],
                    overflow = _part$split2[2];

                if (!key || rest == undefined || overflow) throw modular.err("Insert-Delimiters \"{{\" and \"}}\" do not match.", "@ modular.parse()");

                key = eval(key.trim());
                key = modular.parse(key);
                result += key + rest;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return result;
    },

    // replaces Module-instances with the modules rendered content
    render: function render(context) {
        var components = [];

        modular.components.map(function (comp) {
            if (context.getElementsByTagName(comp.name)[0]) components.push(comp);
        });

        if (components) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var component = _step2.value;

                    var instances = context.getElementsByTagName(component.name);
                    var css = [];

                    component.className = "_modular_" + component.name;

                    if (component.css) {
                        css = modular.transformStyleObj(component.css);
                        css.map(function (el) {
                            modular.documentStyle.innerHTML += "." + component.className + " " + el[0] + " {" + el[1] + "} ";
                        });
                    }

                    for (var i = instances.length - 1; i >= 0; i--) {
                        var ifAttribute = instances[i].getAttribute("m-if");

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
                };

                for (var _iterator2 = components[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    },

    // registers the structure of a router-tag
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

    // updates the router if existing
    routerEvent: function routerEvent() {
        if (modular.router.exists) {
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
    },

    // variables
    components: [],
    tempEl: [],

    router: {
        exists: false,
        element: undefined,
        route: undefined,
        content: undefined,
        base: undefined,
        pages: {},
        redirects: {}
    },

    documentStyle: document.createElement("style"),
    wrapper: document.createElement("div"),

    initialDocument: undefined
};

// 
// instantly executed
modular.hideContent();
modular.initialDocument = document.documentElement.cloneNode(true);
modular.getRouter();

// 
// load event
window.addEventListener("load", function () {
    modular.routerEvent();
    modular.showContent();
});

// 
// the module class

var Mod = function Mod(conf) {
    _classCallCheck(this, Mod);

    if ((typeof conf === "undefined" ? "undefined" : _typeof(conf)) === "object") {
        if (conf.render && conf.name) {
            Object.assign(this, conf);
            this.props = conf.props ? conf.props : {};
            modular.components.push(this);
        } else throw modular.err("Missing values.", "\"name\" and \"render()\" are required.", "new Module()");
    } else throw modular.err("Invalid Module-configuration.", "Configuration must be of type \"object.\"", "new Module()");
};

// 
// renders and parses everything


function renderAll() {
    modular.documentStyle.innerHTML = "";
    document.documentElement.innerHTML = modular.initialDocument.innerHTML;
    if (modular.router.exists) document.getElementsByTagName("router")[0].innerHTML = modular.router.content;
    modular.render(document.documentElement);
    document.documentElement.innerHTML = modular.parse(document.documentElement.innerHTML);
    document.head.appendChild(modular.documentStyle);
}

// 
// navigates the router to the provided url
function routerNavigate(page) {
    modular.router.route = modular.router.base + page;
    window.history.pushState(null, null, modular.router.route);
    modular.routerEvent();
}

// 
// simplifies working with conditions, loops and such in render
function el() {
    var str = "";
    Array.from(arguments).map(function (attr) {
        str += attr;
    });
    modular.tempEl[modular.tempEl.length - 1] += str;

    return modular.tempEl[modular.tempEl.length - 1];
}