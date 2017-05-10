export default (text = "Hello world!!!") => {
    const element = document.createElement("div");
    element.className = "fa fa-hand-spock-o fa-1g x1";

    element.innerHTML = text;

    return element;
};