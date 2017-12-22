import React, {PureComponent} from "react";
import PropTypes from "prop-types";

export default class Notes extends PureComponent {
    static propTypes = {
        notes: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            task: PropTypes.string.isRequired
        }).isRequired).isRequired
    };

    render() {
        const {notes} = this.props;
        return <ul>{notes.map(note =>
            <li key={note.id}>{note.task}</li>
        )}</ul>;
    }
}
