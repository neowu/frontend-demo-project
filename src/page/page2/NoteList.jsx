import React, {PureComponent} from "react";

import Notes from "./Notes";
import uuid from "uuid";
import api from "conf/api.json";

export default class NoteList extends PureComponent {
    state = {
        notes: [{
            id: uuid.v4(),
            task: "Learn React"
        }, {
            id: uuid.v4(),
            task: "Do laundry"
        }]
    };

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat([{
                id: uuid.v4(),
                task: api.some_service_url
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
