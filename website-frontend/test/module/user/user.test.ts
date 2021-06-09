import {push} from "connected-react-router";
import {initialState, UserModule} from "module/user";
import {runSaga} from "redux-saga";
import {AccountAJAXWebService} from "service/AccountAJAXWebService";

test("login_succeed", async () => {
    jest.spyOn(AccountAJAXWebService, "login").mockImplementation(() => Promise.resolve({success: true, name: "test", role: "user", errorMessage: null}));

    const dispatched: any[] = [];
    const module = new UserModule("user", initialState);
    await runSaga({dispatch: action => dispatched.push(action)}, module.login.bind(module), "test", "password").toPromise();

    expect(module.rootState.app.user.currentUser).toStrictEqual({loggedIn: true, role: "user", name: "test"});
    expect(dispatched).toStrictEqual([push("/")]);
});

test("login_failed", async () => {
    jest.spyOn(AccountAJAXWebService, "login").mockImplementation(() => Promise.resolve({success: false, name: null, role: null, errorMessage: "user not found"}));

    const dispatched: any[] = [];
    const module = new UserModule("user", initialState);
    await runSaga({dispatch: action => dispatched.push(action)}, module.login.bind(module), "test", "password").toPromise();

    expect(module.rootState.app.user.currentUser.loggedIn).toBe(false);
    expect(dispatched).toStrictEqual([]);
});
