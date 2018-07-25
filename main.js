let renderCounter = 0;

let myComp = new Component({
    tag: "my-component",

    render() {
        el(`<my-comp-2 num="1"></my-comp-2>`);
        el(`<my-comp-2 num="2"></my-comp-2>`);
        el(`<mp-green-btn text="Click me!"></mp-green-btn>`);
        el(`<h3>Rendered ${renderCounter} times!</h3>`);
        return el();
    },

    css: {
        "h3": {
            userSelect: "none"
        }
    }
});

let myComp2 = new Component({
    tag: "my-comp-2",
    render() {
        el(`<h1>Test ${this.props.num}</h1>`);
        return el();
    },
    css: {
        "h1": {
            color: "#f00",
            cursor: "default"
        },

        "h1:hover": {
            color: "#a0f"
        }
    }
});

window.addEventListener("click", () => {
    renderCounter++;
    render();
});

// modular.time();
// modular.listPlugins();