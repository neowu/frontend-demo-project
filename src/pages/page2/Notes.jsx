import PropTypes from "prop-types";
import React from "react";

export default function Notes({notes}) {
    return <ul>{notes.map((note) =>
        <li key={note.id}>{note.task}</li>
    )}</ul>;
}

Notes.displayName = "Notes";

Notes.propTypes = {notes: PropTypes.array.required};
