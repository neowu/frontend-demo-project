// some 3rd party js, not follow eslint rules
var text = document.createElement("h5");
text.innerText = "created by 3rd party js!";
document.getElementsByTagName("body").item(0).appendChild(text);