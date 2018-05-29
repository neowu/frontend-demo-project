import React from "react";
import {connect} from "react-redux";

const NotFound: React.SFC<{}> = () => (
    <div>
        <h1>Not Found</h1>
    </div>
);

export default connect()(NotFound);
