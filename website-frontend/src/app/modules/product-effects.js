import {call} from "redux-saga/effects";
import {takeLatest} from "../../framework/effects";
import {listProducts} from "../services/products";

function* watchListProduct() {
    yield takeLatest("PRODUCT/LIST", function* () {
        yield call(listProducts);
    });
}

const effects = [watchListProduct];

export default effects;
