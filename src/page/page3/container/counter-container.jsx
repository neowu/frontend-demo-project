import {connect} from "react-redux";

import Counter from "../../../component/counter/counter";

const onIncrement = () => ({type: "INCREMENT"});
const onDecrement = () => ({type: "DECREMENT"});

const mapDispatchToProps = {
    onIncrement,
    onDecrement
};
export default connect(store => ({value: store.counter}), mapDispatchToProps)(Counter);
