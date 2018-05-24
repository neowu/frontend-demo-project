import {errorAction} from "framework/exception";

test("create error action", () => {
    expect(errorAction(null)).toEqual({payload: null, type: "@@framework/error"});
});
