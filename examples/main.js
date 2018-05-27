let myComponent = create({
    name: "my-component",
    render: props => {
      return `<h1>Your name is ${props.name}!`;
    //   return `<h1>Your name is Test!`;
    },
    css: {
      backgroundColor: "#89e",
    }
  });
  
  render([myComponent]);