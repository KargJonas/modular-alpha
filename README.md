![version-badge](https://img.shields.io/badge/version-1.1-brightgreen.svg)
![version-badge](https://img.shields.io/badge/development-active-blue.svg)
![version-badge](https://img.shields.io/badge/license-MIT-orange.svg)

<br>

![logo](https://github.com/KargJonas/random/blob/master/modular/Modular-Logo.png)

# Modular
A independent, lightweight library that simplifies component-based webdevelopment.<br>
<hr>

### Some of the features
- a dynamic <b>component-system</b>
- element-<b>multi-selection</b>
- easy <b>styling</b> (dom-extention)
- <b>hiding</b> and <b>unhiding</b> elements
- <b>creating elements</b> with properties
- easy <b>string-to-html</b> (dom-extention)
<hr>

## How to use it in your project
Add it in just like any other script (**Before any script that uses the library**).

```html
<script src="your/path/to/modular.min.js"></script>
```
#### or
```html
<script src="https://github.com/KargJonas/modular.js/blob/master/dist/modular.min.js"></script>
```
#### or
With require.js

<hr>

## Methods

- ### Element.prototype.css()
Allows you to easily style HTML Elements with strings or objects.
> Example:
```javascript
document.querySelector("#myElement").css("background-color: '#ee4'");
```
#### or
```javascript
document.querySelector("#myElement").css({
  backgroundColor: "#ee4"
});
```
<hr>

- ### select( string, string, ... )
Selects and <b>creates variables</b> for all given css-selectors using a query-selector. Also it <b>returns an array</b> with the element-variables.
> Example
```js
let myElements = select("#myFirstElement", "#mySecondElement", "body#h1");

myElements[0].css("background-color: '#ee4'");
mySecondElement.hide();
```
<hr>

- ### HTML-insert ( "{{  }}" )
Is replaced by its evaluated content.
> Example
#### In your html file:
```html
<body>
  <script>
    myVariable = 5;
  </script>
  
  <h1>5 * 3 = {{ myVariable * 3 }}</h1>
  
  ...
</body>
```
#### Result:
![example-image-2](https://github.com/KargJonas/random/blob/master/modular/example-image-2.png)

<hr>

- ### render([element, element, ...])
Renders the given elements.
<hr>

- ### create( {configuration} )
Creates a modular-component with the given configuration (**"render", "name",** "css", "show", "props") and returns a component, that can be used just like any other DOM-Element
#### Properties you **have to** use:
- **render** used to build the element. **Has to return a value!**
- **name** used to identify the element e.g. at insertion ( <your-element-name></your-element-name> )
#### Properties you can additionaly use:
- **css** Styles the element. Can be a string or a object.
- **show** if false element is hidden. Can be true or false.
- **props** properties passed into the elements render function (merged with those passed in from (the) html instance).
> Example
#### In your script-file:
```js
let myComponent = create({
  name: "my-component",
  render: props => {
    return `<h1>Your name is ${props.name}!`;
  },
  css: {
    backgroundColor: "#f00",
  }
});

render([myComponent]);
```
#### In your html-file:
```
<body>
  <my-component name="John Doe"></my-component>
  <my-component name="Jane Johnson"></my-component>
  
  ...
</body>
```
#### The output:
![example-image](https://github.com/KargJonas/random/blob/master/modular/example-image.png)
<hr>

- ### Element.prototype.hide()
Hides a DOM-element.
> Example
```js
document.querySelector("#myElement").hide();
```
<hr>

- ### Element.prototype.show()
Unhides a DOM-element.
> Example
```js
document.querySelector("#myElement").show();
```
<hr>

- ### String.toHtml()
Allows you to create a HTML-Element from a string.
_Example:_
```let myNewElem = "<h1>Test</h1>".toHtml();```
