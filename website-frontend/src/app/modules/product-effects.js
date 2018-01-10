import {call, put} from "redux-saga/effects";
import {takeLatestWithLoading} from "../../framework/effects";
import {listProducts, loadCreateProductConfig} from "../services/products";

function* watchListProduct() {
    yield takeLatestWithLoading("PRODUCT/LIST", function* () {
        yield call(listProducts);
    });
}

function* watchLoadCreateProductConfig() {
    yield takeLatestWithLoading("PRODUCT/LOAD_CREATE_CONFIG", function* () {
        const response = yield call(loadCreateProductConfig);
        yield put({
            type: "PRODUCT/CREATE_CONFIG",
            response
        });
    });
}

const effects = [watchListProduct, watchLoadCreateProductConfig];

export default effects;
