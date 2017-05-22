import React from "react";
import PropTypes from "prop-types";

const Welcome = ({name}) =>
    <article>welcome {name}</article>;

Welcome.propTypes = {name: PropTypes.string.isRequired};

export default Welcome;
