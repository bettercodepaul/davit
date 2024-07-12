import { ActorTO } from "../dataAccess/access/to/ActorTO";
import { DavitUtil } from "./DavitUtil";

test("Test util isNullOrUndefined", () => {
    // Test objects and expected results.
    const nullObject: null = null; // true
    const undefinedObject: undefined = undefined; // true
    const stringObject: string = "This is an object and not null or undefined"; // false

    expect(DavitUtil.isNullOrUndefined(nullObject)).toEqual(true);
    expect(DavitUtil.isNullOrUndefined(undefinedObject)).toEqual(true);
    expect(DavitUtil.isNullOrUndefined(stringObject)).toEqual(false);
});

test("Test util deep copy", () => {
    const actor1: ActorTO = new ActorTO();
    // not a copy
    const actor2: ActorTO = actor1;
    // a deep copy of the actor
    const copyActor1: ActorTO = DavitUtil.deepCopy(actor1);

    // this is the same object
    expect(actor1 === actor2).toEqual(true);
    // this is a real copy
    expect(actor1 !== copyActor1).toEqual(true);
});

test("Test util valid name", () => {
    // to testing objects
    const emptyName: string = ""; // false
    const validName: string = "This is a valid name"; // true

    expect(DavitUtil.isValidName(emptyName)).toEqual(false);
    expect(DavitUtil.isValidName(validName)).toEqual(true);
});
