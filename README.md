![version-badge](https://img.shields.io/badge/version-1.0-brightgreen.svg)
![version-badge](https://img.shields.io/badge/development-completed-blue.svg)
![version-badge](https://img.shields.io/badge/license-MIT-orange.svg)

<br>

![logo](https://github.com/KargJonas/random/blob/master/modular/Modular-Logo.png)

# Modular
#### A independent, lightweight library that simplifies component-based webdevelopment.<br>

<hr>

## How to use it in your project
Just like any other script.<br>
> ```html
> <script src="path/to/modular.js">
> ```

<hr>

## Methods
- ### HTML-insert {{ }}
Is replaced by its evaluated content by modular.parse()
> ### Example
>
>```html
><h1>{{5 + 5}}</h1>
>```
<hr>

- ### renderAll()
#### Has to be called after creation of your modules inorder to show them on the page.
Renders all components used and inserts them into the document.
Can be called multiple times because the initial document is used.
Also "parses" the page.
<hr>

- ### new Mod( {configuration} )
Creates a new "Module" with the given configuration ( **"render", "name",** "css", "props" ).
#### Properties you *have to* provide:
- **render** used to build the element. Can be a DOM-element, a string or a function ( That returns a value ).
- **name** used to identify the element at insertion ( <your-element-name></your-element-name> )
#### Properties you can additionaly use:
- **css** Used to style the element(s).
- **props** properties passed into the elements render function ( merged with those passed in from the/a html instance ).
> ### Example
> #### In your script-file:
> ```javascript
> let myComponent = new Mod({
>   name: "my-component",
>   render: props => {
>     return `<h1 id="myTitle">Your name is ${props.name}!</h1>`;
>   },
>   css: {
>     "#myTitle:hover": {
>       backgroundColor: "#dc4"
>     }
>   }
> });
> 
> renderAll();
> ```
> #### In your html-file:
> ```html
> <body>
>   <my-component name="John Doe"></my-component>
>   <my-component name="Jane Johnson"></my-component>
>   
>   ...
> </body>
> ```
> #### The output:
> ![example-image](https://github.com/KargJonas/random/blob/master/modular/example-image.png)
<hr>

- ### el()
Simplifies working with "html" in Mod.render(). Adds the passed in argumants to a string and returns it.
> ### Example
> ```javascript
> let myMod = new Mod({
>     name: "my-mod",
>     render: () => {
>         el("<h1>List of heroes</h1>");
> 
>         for (let hero of heroes) {
>           el(`<li>${hero} is a true hero!</li>`);
>         }
>
>         return el();
>     }
> });
> 
> let heroes = ["John Doe", "Jane Dough", "Johnny Doeson"];
>
> renderAll();
> ```
>
> ### Output
> ![example-image-3](https://github.com/KargJonas/random/blob/master/modular/example-image-3.png)

<hr>

- ### The router
Routers allow you to create single-page-websites.

A router is defined in HTML and can be modified in a script.

> ### Example
> #### In your html-file:
> ```html
> <!-- All of your singelpage-buisness is done inside the router-tag you can only use one of it in a modular project-->
> <router base="/examples">
>   <!-- This is a page. You can specify on what url it displayed. All page-urls are relative to the router-base. In this case it would be displayed at "myWebsite.com/examples/home" or at "myWebsite.com/examples". The || seperates the possible urls. -->
>   <page path="/home || /">
>     <h1>Hello World</h1>
>     <p>Welcome to this homepage!</h1>
>   </page>
> 
>   <!-- This is displayed when there is no page for the current url. If there is no /404 page, the default 404 page is used. -->
>   <page path="/404">
>     <h1>404 - Page not found</h1>
>   </page>
> 
>   <!-- This is a redirection. When the current url is equal to the url provided in "from", the modular router is redirected to the url specifyed in "to" -->
>   <redirect from="/private" to="/home"></redirect>
>   <redirect from="/super-private" to="/home"></redirect>
> </router>
> 
> <!-- This is a router-link it can be outside of the router. When clicked, redirected to the url specifyed in "to". -->
> <router-link to="/home">Go Home</router-link>
> ```

### Important:
Inorder to be able to use the router on an Apache webserver you will have to use this server configuration:
> ```apache
> <IfModule mod_rewrite.c>
> 	RewriteEngine on
> 	RewriteCond %{REQUEST_FILENAME} -f [OR]
> 	RewriteCond %{REQUEST_FILENAME} -d
> 	RewriteRule ^ - [L]
> 	RewriteRule ^ index.html [L]
> </IfModule>
> ```

On a node server, you will have to use a static configuration (send the same page as response for all directorys).

<hr>

- ### routerNavigate()
Navigates the router to the given page (relative to the base path).

<hr>