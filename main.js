let myEl = new Component({
    tag: "test",

    render(props) {
        el(`<h1>Working ${props.testval}</h1>`);
        return el();
    },

    css: {
        "h1": {
            color: "#f00"
        }
    }
});

render();

// modular.time();
// modular.listPlugins();