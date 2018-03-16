import {call, put} from "redux-saga/effects";
import {takeLatestWithLoading} from "framework/effect";
import productAJAXService from "module_v2/product/ajax/product";
import {Effect} from "framework/application";

function* watchListProduct() {
    yield takeLatestWithLoading("PRODUCT/LIST", function* () {
        yield call(productAJAXService.list);
    });
}

function* watchLoadCreateProductConfig() {
    yield takeLatestWithLoading("PRODUCT/LOAD_CREATE_CONFIG", function* () {
        const response = yield call(productAJAXService.createConfig);
        yield put({
            type: "PRODUCT/CREATE_CONFIG",
            response
        });
    });
}

const effects: Effect[] = [watchListProduct, watchLoadCreateProductConfig];

export default effects;
