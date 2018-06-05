let home = new Module({
    name: "home-module",
    render: props => {
        return `<div>
            <h1 class="t">Test</h1>
            <h1 class="t">Test</h1>
            <h1 class="t">Test</h1>
        </div>`;
    },
    css: {
        ".t:hover": {
            border: "2px dashed #000",
            color: "#000"
        }
    }
});

render();