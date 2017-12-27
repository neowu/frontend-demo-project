import React, {PureComponent} from "react";

import Notes from "./Notes";
import api from "conf/api.json";

export default class NoteList extends PureComponent {
    themeSCSS = "theme-a.less";

    state = {
        notes: [{
            id: "1",
            task: "Learn React"
        }, {
            id: "2",
            task: "Do laundry"
        }],
        className: null
    };

    addNote = () => {
        import(`../../asset/css/${this.themeSCSS}`)
            .then((style) => {
                this.setState({
                    notes: [...this.state.notes, {
                        id: Math.random().toString(36).substring(7),
                        task: api.someServiceURL
                    }],
                    className: style.button
                });
                document.body.className = style.background;
            });

        this.themeSCSS = this.themeSCSS === "theme-a.less" ? "theme-b.less" : "theme-a.less";
    };

    render() {
        const {notes, className} = this.state;

        return <div>
            <button className={className} onClick={this.addNote}>+</button>
            <Notes notes={notes}/>
        </div>;
    }
}
