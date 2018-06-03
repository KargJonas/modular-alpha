"use strict";
// Jonas Karg 2018

//
// Core

var _typeof =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      };

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var modular = {
  // Hiding and unhiding the entire page
  hideContent: function hideContent() {
    return (document.documentElement.style.display = "none");
  },
  showContent: function showContent() {
    return (document.documentElement.style.display = "block");
  },

  // Convert values render-property content to element
  toHtml: function toHtml(str, props) {
    if (typeof str === "function") {
      str = str(props || {});
    }

    if (typeof str === "string") {
      modular.wrapper.innerHTML = str;
      return modular.wrapper.firstChild;
    } else return str;
  },

  // Convert an elements attributes into an object
  elemToObj: function elemToObj(elem) {
    var obj = {};

    Array.from(elem.attributes).map(function(attr) {
      obj[attr.name] = attr.value;
    });

    return obj;
  },

  // Throw an error
  err: function err(msg, pos) {
    var error = "Modular Error: " + msg;
    return pos ? error + "\n--> @ " + pos : error;
  },

  warn: function warn(msg, pos) {
    var warning = "Modular Warning/Info: " + msg;
    return pos ? warning + "\n--> @ " + pos : warning;
  },

  // Evalates everything between "{{" and "}}"
  parse: function parse(context) {
    var text = context.toString().split("{{");
    var result = text.shift();

    for (
      var _iterator = text,
        _isArray = Array.isArray(_iterator),
        _i = 0,
        _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
      ;

    ) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var part = _ref;

      var _part$split = part.split("}}"),
        key = _part$split[0],
        rest = _part$split[1],
        overflow = _part$split[2];

      if (!key || rest == undefined || overflow) {
        throw modular.err(
          'Insert-Delimiters "{{" and "}}" do not match.',
          "parse()"
        );
      }

      key = eval(key.trim());
      key = modular.parse(key);
      result += key + rest;
    }

    return result;
  },

  time: function time() {
    console.warn(
      modular.warn(
        "Modular info: " + (new Date() - modular.initDate) + "ms",
        "time()"
      )
    );
  },

  render: function render(context) {
    var components = [];

    modular.components.map(function(comp) {
      if (context.getElementsByTagName(comp.name)[0]) {
        components.push(comp);
      }
    });

    if (components) {
      for (
        var _iterator2 = components,
          _isArray2 = Array.isArray(_iterator2),
          _i2 = 0,
          _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();
        ;

      ) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var component = _ref2;

        var instances = context.getElementsByTagName(component.name);

        for (var i = instances.length - 1; i >= 0; i--) {
          component.rendered = modular.toHtml(
            component.render,
            Object.assign(
              component.props,
              modular.elemToObj(instances[i]) || {}
            )
          );
          modular.render(component.rendered);
          component.rendered.css(component.css);
          instances[i].outerHTML = component.rendered.outerHTML;
        }
      }
    }
  },

  getRouter: function getRouter() {
    var router = document.getElementsByTagName("router");
    if (router.length > 1) {
      throw modular.err("More than one router found", "render");
    } else if (router.length === 1) {
      modular.router.exists = true;
      router = router[0];
      modular.router.base = router.getAttribute("base");
      var pages = Array.from(router.getElementsByTagName("page"));
      var redirects = Array.from(router.getElementsByTagName("redirect"));
      var links = Array.from(document.getElementsByTagName("router-link"));

      if (!modular.router.base) {
        modular.router.base = "";
      }

      modular.router.pages[modular.router.base + "/404"] =
        "<h1>404: Page not Found</h1>";

      pages.map(function(page) {
        var paths = page
          .getAttribute("path")
          .replace(/\/$/, "")
          .split("||");
        paths.map(function(path) {
          modular.router.pages[
            modular.router.base + path.trim()
          ] = page.innerHTML.trim();
        });
      });

      redirects.map(function(redirect) {
        var from = redirect.getAttribute("from").replace(/\/$/, "");
        var to = redirect.getAttribute("to").replace(/\/$/, "");
        modular.router.redirects[modular.router.base + from] =
          modular.router.base + to;
      });

      links.map(function(link) {
        var to = link.getAttribute("to").replace(/\/$/, "");
        link.setAttribute("onclick", 'routerNavigate("' + to + '")');
        link.css({
          color: "#00e",
          textDecoration: "underline",
          cursor: "pointer"
        });
      });

      // window.addEventListener("popstate", () => {
      //     modular.routerEvent();
      // });
    }
  },

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
          modular.router.content =
            modular.router.pages[modular.router.base + "/404"];
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
  wrapper: document.createElement("div"),
  initialDocument: undefined,
  initDate: new Date()
};

//
// Set CSS
Element.prototype.css = function(css) {
  if (typeof css === "string") {
    this.setAttribute("style", css.replace(/\s+/g, " ").trim());
  } else if (
    (typeof css === "undefined" ? "undefined" : _typeof(css)) === "object"
  ) {
    Object.assign(this.style, css);
  }
};

//
// Instantly executed
modular.hideContent();
modular.initialDocument = document.documentElement.cloneNode(true);
modular.getRouter();

//
// OnLoad event
window.addEventListener("load", function() {
  modular.routerEvent();
  modular.showContent();
  modular.time();
});

//
// The module class

var Module = function Module(conf) {
  _classCallCheck(this, Module);

  if (
    (typeof conf === "undefined" ? "undefined" : _typeof(conf)) === "object"
  ) {
    if (conf.render && conf.name) {
      Object.assign(this, conf);
      this.props = conf.props ? conf.props : {};
      modular.components.push(this);
    } else throw modular.err("Missing inputs", "new Module()");
  } else
    throw modular.err(
      'Invalid input\n--> Must be of type "object"',
      "new Module()"
    );
};

//
// Renders and parses everything

function render() {
  if (modular.router.exists) {
    document.getElementsByTagName("router")[0].innerHTML =
      modular.router.content;
  }
  modular.render(document.documentElement);
  document.documentElement.innerHTML = modular.parse(
    document.documentElement.innerHTML
  );
}

//
// Navigates the router to the provided url
function routerNavigate(page) {
  modular.router.route = modular.router.base + page;
  window.history.pushState(null, null, modular.router.route);
  modular.routerEvent();
}
