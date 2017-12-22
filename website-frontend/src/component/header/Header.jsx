import React from "react";
import axios from "axios";

class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {result: false};
    }

    componentDidMount() {
        axios.get("/ajax/test")
            .then((response) => {
                const success = response.data.success;
                this.setState({result: success});
            });
    }

    render() {
        return <div>
            {this.state.result ? "true" : "false"}
        </div>;
    }
}

export default Header;
