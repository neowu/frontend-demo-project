import {call, put} from "redux-saga/effects";
import {takeLatest} from "../../framework/effects";
import {listProducts, loadCreateProductConfig} from "../services/products";

function* watchListProduct() {
    yield takeLatest("PRODUCT/LIST", function* () {
        yield call(listProducts);
    });
}

function* watchLoadCreateProductConfig() {
    yield takeLatest("PRODUCT/LOAD_CREATE_CONFIG", function* (action) {
        const response = yield call(loadCreateProductConfig);
        yield put({
            type: "PRODUCT/CREATE_CONFIG",
            response
        });
    });
}

const effects = [watchListProduct, watchLoadCreateProductConfig];

export default effects;
