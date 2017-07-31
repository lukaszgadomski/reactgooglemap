import { apiAddress } from "./api";
import configureStore from "redux-mock-store";

describe("fetch adress from github", () => {
  test("fetch success", () => {
    const mockStore = configureStore([]);
    const store = mockStore({});
    return apiAddress.fetch(store).then(res => {
      expect(res).toBeTruthy();
    });
  });
});
