import React, {PureComponent} from "react";
import PropTypes from "prop-types";

export default class Notes extends PureComponent {
    static propTypes = {notes: PropTypes.array.isRequired};

    render() {
        const {notes} = this.props;
        return <ul>{notes.map(note =>
            <li key={note.id}>{note.task}</li>
        )}</ul>;
    }
}
