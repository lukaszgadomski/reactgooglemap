import reducer from "./reducers";
import types from "./ActionTypes";
import initialState from "../../storeInitialState";
import * as actions from "./actions";

describe("todos reducer", () => {
  test("should handle CLICK_ADDRESS", () => {
    const givenSelected = {
      id: 1,
      address: "Warszawa, ul. Grzybowska 37",
      hours: [
        { day: "Niedziela", hours: "brak danych" },
        { day: "Poniedziałek", hours: "10:00 - 19:00" },
        { day: "Wtorek", hours: "10:00 - 19:00" },
        { day: "Środa", hours: "10:00 - 19:00" },
        { day: "Czwartek", hours: "10:00 - 19:00" },
        { day: "Piątek", hours: "10:00 - 19:00" },
        { day: "Sobota", hours: "brak danych" }
      ],
      name: "Alsen",
      lat: "52.2351646",
      lng: "20.9942039"
    };
    expect(
      reducer(initialState.addresses, actions.clickAddress(givenSelected))
    ).toMatchSnapshot();
  });
});
