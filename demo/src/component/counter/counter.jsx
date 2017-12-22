import React from "react";
import PropTypes from "prop-types";

const Counter = ({value, onIncrement, onDecrement}) => {
    const incrementIfOdd = () => {
        if (value % 2 !== 0) {
            onIncrement();
        }
    };

    const incrementAsync = () => {
        setTimeout(onIncrement, 1000);
    };

    return <p>
        Clicked: {value} times
        {" "}
        <button onClick={onIncrement}>+</button>
        {" "}
        <button onClick={onDecrement}>-</button>
        {" "}
        <button onClick={incrementIfOdd}>Increment if odd</button>
        {" "}
        <button onClick={incrementAsync}>Increment async</button>
    </p>;
};

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired
};

export default Counter;
