// ALWAYS use a selector ( e.g.: document.getElementById() ) for elements!
// properties from a tag are always lowercase.

let body = new Module({
    name: "body",
    render: () => {
        return document.body;
    },
    css: {
        margin: 0,
        fontFamily: "sans-serif"
    }
});

// Topbar Module
let topbar = new Module({
    name: "topbar-module",
    render: props => {
        return `<h1>Modular ${props.test}</h1>`;
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
    },
    props: {
        test: "Hello 123"
    }
});

// Page Module
let pageContent = new Module({
    name: "home-module",
    render: props => {
        let insert = "";
        for (let i = 1; i < 4; i++) {
            insert += `<insert-module index="${i}"></insert-module>`;
        }

        return `<div id="test">
            <h1>Welcome ${props.message}!</h1>
            ${insert}
        </div>`;
    },
    css: {
        padding: "0 7%",
        marginTop: "80px"
    }
});

let insertModule = new Module({
    name: "insert-module",
    render: props => {
        return `<h1>This is insert-module #${props.index}</h1>`;
    },
    css: {
        fontSize: "16px",
        padding: "2px 5px",
        borderBottom: "1px solid #bbb"
    }
});

let notFoundModule = new Module({
    name: "notfound-module",
    render: () => {
        return `<h1 style="margin: 130px 7% 0 7%;">404: This page could not be found!</h1>`;
    }
});

render();