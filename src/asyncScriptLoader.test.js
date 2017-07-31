import asyncScriptLoader from "./asyncScriptLoader";

describe("Load script should resolve after successfull download", () => {
  test("load google map api script", done => {
    asyncScriptLoader(
      "http://maps.googleapis.com/maps/api/js?v=3&sensor=false"
    ).then(() => {
      expect(google.maps.Map).toBeTruthy();
      done();
    });
  });
});
