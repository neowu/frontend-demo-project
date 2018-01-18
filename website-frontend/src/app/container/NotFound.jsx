import React from "react";
import {connect} from "react-redux";

const NotFound = () => <div>
    <h1>Not Found</h1>
</div>;

NotFound.propTypes = {};

export default connect()(NotFound);
