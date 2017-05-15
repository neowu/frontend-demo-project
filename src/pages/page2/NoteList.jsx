import api from "conf/api.json";
import Notes from "./Notes";
import React from "react";
import uuid from "uuid";

export default class NoteList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [
                {
                    id: uuid.v4(),
                    task: "Learn React"
                },
                {
                    id: uuid.v4(),
                    task: "Do laundry"
                }
            ]
        };
    }

    render() {
        const {notes} = this.state;
        return (
            <div>
                <button onClick={this.addNote}>+</button>
                <Notes notes={notes}/>
            </div>
        );
    }

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat([{
                id: uuid.v4(),
                task: api.some_service_url
            }])
        });
    };
}
