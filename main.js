let myComp = new Component({
    tag: "my-component",

    render(props) {
        el(`<h1>Hello World, ${props.name}</h1>`);
        el(`<p>you are user #${props.number}!</p>`);

        return el();
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

// modular.time();
// modular.listPlugins();