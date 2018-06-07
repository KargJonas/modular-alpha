let myMod = new Mod({
    name: "my-mod",
    render: () => {
        el("<div>");
        el("<h1>List of heroes</h1>");

        for (let hero of heroes) {
          el(`<li>${hero} is a true hero!</li>`);
        }

        el("</div>");
        return el();
    }
});

let heroes = ["John Doe", "Jane Dough", "Johnny Doeson"];

renderAll();