let myComp = create({
    name: "my-component",
    render: props => {
        return (
            `<div>
                ${props.myfirstname} ${props.mylastname}
                <second-component></second-component>
            </div>`
        );
    },
    css: {
        padding: "5px",
        border: "2px dashed #000",
        backgroundColor: "#ee4"
    },
    hide: false,
    props: { // This is merged with the element-attributes
        mylastname: "Karg"
    }
})

let secondComp = create({
    name: "second-component",
    render: props => {
        return `<h1>{{ 5 + 5}}</h1>`;
    },
    css: {
        padding: "5px",
        border: "2px dashed #000",
        backgroundColor: "#ee4"
    },
    hide: false
})

render([myComp, secondComp])