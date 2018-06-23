let myComp = new Component({
    tag: "my-component",

    render(props) {
        el(`<h1>Prebuilt components test</h1>`);
        el(`<mp-green-btn text="test"></mp-green-btn>`);
        // el("<my-comp-2></my-comp-2>");
        return el();
    },
});

let myComp2 = new Component({
    tag: "my-comp-2",
    render() {
        el("<h1>Test</h1>");
        return el();
    }
});

render();

// modular.time();
// modular.listPlugins();