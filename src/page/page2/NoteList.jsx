import React, {PureComponent} from "react";

import Notes from "./Notes";
import api from "conf/api.json";

export default class NoteList extends PureComponent {
    state = {
        notes: [{
            id: "1",
            task: "Learn React"
        }, {
            id: "2",
            task: "Do laundry"
        }]
    };

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat([{
                id: Math.random().toString(36).substring(7),
                task: api.someServiceURL
            }])
        });
    };

    render() {
        const {notes} = this.state;
        return (
            <div>
                <button onClick={this.addNote}>+</button>
                <Notes notes={notes}/>
            </div>
        );
    }
}
