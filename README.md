![version-badge](https://img.shields.io/badge/version-1.1-brightgreen.svg)
![version-badge](https://img.shields.io/badge/development-active-blue.svg)
![version-badge](https://img.shields.io/badge/license-MIT-orange.svg)

# Modular
### A lightweight, independent framework that simplifies component-based webdevelopment and matches great with most librarys.

<br>

![logo](https://github.com/KargJonas/random/blob/master/modular/Modular-Logo.png)

> Using modular in your project is simple. Just include it in your HTML with all the plugins you want to use following it and you're ready to go.

```html
<!-- Modular core -->
<script src="path/to/modular.js"></script>

<!-- Modular Plugins -->
<script src="path/to/plugins/modular.tools.js"></script>
...
```

> This is how a component could look like:
```js
let myComp = new Component({
    tag: "my-component",

    render(props) {
        return `<h1>Hello World, ${props.name}</h1>
            <p>you are user #${props.number}!</p>`;
    },

    css: {
        "h1": {
            "color": "#f00"
        }
    },

    props: {
        number: 17
    }
});
```
> Components are instances of the "Component"-class. When this class is instantiated, a configuration-object has to be passed into the constructor.

> The configuration-object has to have a "tag"- and a "render"-attribute but it can have as many others as you want. Some attributes however, are reserved for modular.

## The "tag"-attribute
> The "tag"-attribute is the tagName used to insert the component into your html or into another component. If a component is not inserted anywhere it won't be rendered at all.

## HTML-instantiation of a Component
### The component above could be instantiated like this:
```html
<my-component name="John Doe"></my-component>
```

## The "render"-attribute
> The "render"-attribute of a component has to be a function, which returns a value. When a component is rendered, the components' "render"-function will be called and the returned value, encapsulated by a div will replace it's HTML-tag.

> The "name"-attribute will be passed into the components' render-function inside of a object - in this case the object is called "props" so "props.name" would be "John Doe". _Remember - You can have as many attributes as you want_. They will all become entries in the object, that is passed into the components' render-function.

> Also, components can be instantiated (in HTML) as often as you want. The cool part is that you can use different HTML-attribures every time.

## The "props"-attribute
> The "props"-attribute is an object. It is merged with the attribtes from the HTML-instantiation.
> 
### The HTML-component-instance above would turn into this when **render()** is called:
```html
<div class="_component_my-component _component_">
    <h1>Hello World, John Doe</h1>
    <p>you are user #17!</p>
</div>
```

## The "css"-attribute
> The "css"-attribute is used for styling. It only styles the component, so you can use a "h1"-selector without affecting anything but the "h1"-tags in the current component.

### The "css"-attribute is an object. It is structured like this:
```
css: {
  selector: {
    styleAttribute: value
  },

  anotherSelector: {
    anotherStyleAttribute: anotherValue
  }
}
```

## render()
After you have created all of your components, you have to call render() inorder to render all of the components. If you forget to do so, there won't be much to see.

## The complete example
```html
<!DOCTYPE html>
<html>
    <head>
        <title>Modular example</title>
    </head>

    <body>
        <my-component name="John Doe"></my-component>

        <script src="path/to/modular.js"></script>
        <script>
            let myComp = new Component({
                tag: "my-component",

                render(props) {
                    return `<h1>Hello World, ${props.name}</h1>
                        <p>you are user #${props.number}!</p>`;
                },

                css: {
                    "h1": {
                        "color": "#f00"
                    }
                },

                props: {
                    number: 17
                }
            });

            render();
        </script>
    </body>
</html>
```

### Output
![example-img](https://github.com/KargJonas/random/blob/master/modular/example-image-4.png)

## el()
> The "el"-function is a global function, which is supposed to help you work with elements in "component.render". You can pass as many strings into "el()" as you want. They will be joined and then returned. When el() is called next time it's arguments will again be joined and added to the provious ones. When the components' render-function returns a value el's content is cleared ().

> All of this allows us to do some funky stuff in component.render fairly easily.

### The render-function from the component above can be reritten to something like this:
```js
    ...
    render(props) {
        el(`<h1>Hello World, ${props.name}</h1>`);
        el(`<p>you are user #${props.number}!</p>`);
        return el();
        // Returns "<h1>Hello World, John Doe</h1><p>you are user #17!</p>"
    },
    ...
```

### Another example usage:
```js
    ...
    render(props) {
        el(`<h1>${props.title}</h1>`);

        if (props.loop == 0) el("<p>No Loop.</p>");

        for(let i = 0; i < props.loop; i++) {
            el(`<li>Hi - I am list-item #${i + 1}!</li>`);
        }

        return el();
    },
    ...
```
```html
    <my-component title="First list" loop="20"></my-component>
    <my-component title="Second list" loop="0"></my-component>
```
### Output
![example-img](https://github.com/KargJonas/random/blob/master/modular/example-image-5.png)