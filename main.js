let myComp = new Component({
    tag: "my-component",

    render(props) {
        el(`<my-comp-2 num="1"></my-comp-2>`);
        el(`<my-comp-2 num="2"></my-comp-2>`);
        return el();
    },
});

let myComp2 = new Component({
    tag: "my-comp-2",
    render() {
        el(`<h1>Test ${this.props.num}</h1>`);
        return el();
    }
});

render();

// modular.time();
// modular.listPlugins();