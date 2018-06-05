![version-badge](https://img.shields.io/badge/version-0.3-brightgreen.svg)
![version-badge](https://img.shields.io/badge/development-active-blue.svg)
![version-badge](https://img.shields.io/badge/license-MIT-orange.svg)

<br>

![logo](https://github.com/KargJonas/random/blob/master/modular/Modular-Logo.png)

# Modular
A independent, lightweight library that simplifies component-based webdevelopment.<br>

> Warning!

> This library is still under construction and it is not recommended using it for anything "serious" until the first stable version is released.

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

- ### render()
Renders all components used in the current context.
<hr>

- ### new Module( {configuration} )
Creates a Module with the given configuration ( **"render", "name",** "css", "props" ).
#### Properties you **have to** use:
- **render** used to build the element. Can be a DOM-element, a string or a function ( That returns a value ).
- **name** used to identify the element at insertion ( <your-element-name></your-element-name> )
#### Properties you can additionaly use:
- **css** Styles the element. Can be a string or a object.
- **props** properties passed into the elements render function ( merged with those passed in from the/a html instance ).
> Example
#### In your script-file:
```javascript
let myComponent = new Module({
  name: "my-component",
  render: props => {
    return `<h1>Your name is ${props.name}!</h1>`;
  },
  css: {
    backgroundColor: "#f00",
  }
});

render();
```
#### In your html-file:
```html
<body>
  <my-component name="John Doe"></my-component>
  <my-component name="Jane Johnson"></my-component>
  
  ...
</body>
```
#### The output:
![example-image](https://github.com/KargJonas/random/blob/master/modular/example-image.png)
<hr>

<br>
<br>
## The router
Routers allow you to create single-page-websites.

A router is defined in HTML and can be modified in a script.

> Example
#### In your html-file:
```html
<!-- All of your singelpage-buisness is done inside the router-tag you can only use one of it in a modular project-->
<router base="/examples">
  <!-- This is a page. You can specify on what url it displayed. All page-urls are relative to the router-base. In this case it would be displayed at "myWebsite.com/examples/home" or at "myWebsite.com/examples". The || seperates the possible urls. -->
  <page path="/home || /">
    <h1>Hello World</h1>
    <p>Welcome to this homepage!</h1>
  </page>

  <!-- This is displayed when there is no page for the current url. If there is no /404 page, the default 404 page is used. -->
  <page path="/404">
    <h1>404 - Page not found</h1>
  </page>

  <!-- This is a redirection. When the current url is equal to the url provided in "from", the modular router is redirected to the url specifyed in "to" -->
  <redirect from="/private" to="/home"></redirect>
  <redirect from="/super-private" to="/home"></redirect>
</router>

<!-- This is a router-link it can be outside of the router. When clicked, redirected to the url specifyed in "to". -->
<router-link to="/home">Go Home</router-link>
```

### Important:
> Inorder to be able to use the router on an Apache webserver you will have to use this server configuration:
```apache
<IfModule mod_rewrite.c>
	RewriteEngine on
	RewriteCond %{REQUEST_FILENAME} -f [OR]
	RewriteCond %{REQUEST_FILENAME} -d
	RewriteRule ^ - [L]
	RewriteRule ^ index.html [L]
</IfModule>
```

> On a node server, you will have to use a static configuration (send the same page as response for all directorys).

Further details coming soon.
