let home = new Mod({
    name: "home-module",
    render: props => {
        el("<div>");
        for (let i of myArr) el(`<h1>${i}</h1>`);
        el("</div>");

        return el();
    },
    css: {
        h1: {
            border: "1px solid #000"
        }
    }
});

let myArr = ["fghfgh", "hfghdj", "iozjkhk", "wergnt"];

renderAll();