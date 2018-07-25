let time = 0;

let myComp = new Component({
    tag: "time",

    render() {
        el(`<h3>You've been on this page for ${time} second(s).</h3>`);
        el(`<h3>That's ${Math.floor(time / 60)} minute(s) and ${time % 60} second(s).</h3>`);
        return el();
    },

    css: {
        h3: {
            color: "#8ad"
        }
    }
});

render();
window.setInterval(() => {
    time += 1;
    render();
}, 1000);