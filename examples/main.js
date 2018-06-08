let myMod = new Mod({
    name: "my-mod",
    render: props => {
        el("<div>");
        el("<h1>List of heroes</h1>");

        for (let hero of props.name) {
          el(`<li>${hero} is a true hero!</li>`);
        }

        el("</div>");
        return el();
    },
    css: {
        li: {
            border: "solid 1px #000",
            marginBottom: "2px"
        }
    }
});

let heroes = ["John Doe", "Jane Dough", "Johnny Doeson"];

renderAll();