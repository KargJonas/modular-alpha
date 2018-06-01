// ALWAYS use a selector ( e.g.: document.getElementById() ) for elements!

document.body.css({
    margin: 0,
    backgroundColor: "#eee",
    fontFamily: "monospace"
});

// Topbar Module
let topbar = new Module({
    name: "topbar-module",
    render: props => {
        return `<h1>WebSpot</h1>`;
    },
    css: {
        backgroundColor: "#fff",
        fontSize: "36px",
        padding: "5px 7%",
        margin: 0,
        width: "100%",
        boxShadow: "0 0 8px #555",
        position: "fixed",
        top: "0"
    }
});

// Page Module
let pageContent = new Module({
    name: "home-module",
    render: props => {
        return `<div id="test">
            <h1>Welcome Home!</h1>
        </div>`;
    },
    css: {
        padding: "0 7%",
        marginTop: "80px"
    }
});

render([topbar, pageContent]);
modular.time();