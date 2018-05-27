![version-badge](https://img.shields.io/badge/version-1.0-brightgreen.svg)
![version-badge](https://img.shields.io/badge/development-active-blue.svg)
![version-badge](https://img.shields.io/badge/license-MIT-orange.svg)

<br>

![logo](https://github.com/KargJonas/random/blob/master/modular/Modular-Logo.png)

# Modular
A lightweight library that simplifies component-based webdevelopment.<br>
### It provides features as:
- a dynamic component-system
- element-multi-selection
- easy styling (dom-extention)
- hiding and unhiding elements
- creating elements with properties
- dynamic element-outputs
- easy string-to html (dom-extention)
- ...

## Methods
#### - Element.prototype.css()
Allows you to easily style HTML Elements with strings or objects.

#### - select( string, string, ... )
Selects and creates variables for all given css-selectors using a query-selector. Also it returns an array with the element-variables.

#### - create( {parameters} )
Creates a modular-component with the given parameters ("el", "css", "show", ...).

#### - DomElement.hide()
Hide a DOM-element.

#### - DomElement.show()
Unhide a DOM-element.

#### - String.toHtml()
Allows you to create a DOM-Element from a string.
##### Example
```let myNewElem = "<h1>Test</h1>".toHtml();```
