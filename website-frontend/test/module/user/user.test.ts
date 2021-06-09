import {call} from "core-fe";

import {AccountAJAXWebService} from "service/AccountAJAXWebService";
// AccountAJAXWebService.login = () => Promise.resolve({success: true, name: "test", role: "user", errorMessage: null});

import {initialState, UserModule} from "module/user";

// jest.mock("service/AccountAJAXWebService", () => ({
//     AccountAJAXWebService: {
//         login: jest.fn()
//     }
// }));

test("login", () => {
    // jest.fn(AccountAJAXWebService.login).mockImplementation(()=>Promise.resolve({success: true, name: "test", role: "user", errorMessage: null}));

    // jest.spyOn(AccountAJAXWebService, "login").mockImplementation(() => {
    //     console.warn("test here");
    //     return Promise.resolve({success: true, name: "test", role: "user", errorMessage: null})
    // });

    const login = AccountAJAXWebService.login({username: "test", password: "password"});

    const module = new UserModule("user", initialState);
    const saga = module.login("test", "password");
    const result = saga.next();
    // const next = saga.next();
    // console.warn("print "+ JSON.stringify(result));
    // // expect(result.value).toBe(call(AccountAJAXWebService.login, {username: "test", password: "password"}).next().value);
    // expect(next.value).toBe(true);
    // expect(module.rootState.app.user.currentUser.loggedIn).toBe(true);
});
