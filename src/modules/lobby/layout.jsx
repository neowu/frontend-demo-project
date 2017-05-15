import React from "react";

export default class Layout extends React.Component {
    render() {
        return <div>
            <div>It is lobby module</div>
            <iframe src="../page1/index.html" width='100%' height='550px'></iframe>
        </div>;
    }
}
