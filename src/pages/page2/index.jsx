import Axios from "axios";
import NoteList from "./NoteList";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <NoteList/>, document.getElementById("app"));

Axios.get("http://www.google.com").then((response) => {
    document.getElementById("ajax").innerText = response;
}).catch((error) => {
    document.getElementById("ajax").innerText = error;
});
