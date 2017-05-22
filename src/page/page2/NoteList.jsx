import React, {PureComponent} from "react";

import Notes from "./Notes";
import api from "conf/api.json";

import themeA from "../../asset/css/theme-a.useable.scss";
import themeB from "../../asset/css/theme-b.useable.scss";

export default class NoteList extends PureComponent {
    useA = true;

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
        if (this.useA) {
            themeA.use();
            themeB.unuse();
        } else {
            themeA.unuse();
            themeB.use();
        }

        this.setState({
            notes: [...this.state.notes, {
                id: Math.random().toString(36).substring(7),
                task: api.someServiceURL
            }]
        });

        this.useA = !this.useA;

        // import(`../../asset/css/${this.state.theme}.scss`)
        //     .then((style) => {
        //         this.setState({
        //             notes: [...this.state.notes, {
        //                 id: Math.random().toString(36).substring(7),
        //                 task: api.someServiceURL
        //             }],
        //             theme: this.state.theme === "theme-b" ? "theme-a" : "theme-b",
        //             style: style.button
        //         });
        //     });
    };

    render() {
        const {notes} = this.state;

        return <div>
            <button onClick={this.addNote}>+</button>
            <Notes notes={notes}/>
        </div>;
    }
}
