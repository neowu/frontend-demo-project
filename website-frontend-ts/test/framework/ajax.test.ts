import {json} from "framework/ajax";

test("json", () => {
    expect(json("{\"date\": \"2018-05-24T12:00:00.000Z\"}")).toEqual({date: new Date("2018-05-24T12:00:00.000Z")});
});
