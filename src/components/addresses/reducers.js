import initialState from "../../storeInitialState";
import types from "./actionTypes";

export default function addresses(state = initialState.addresses, action) {
  switch (action.type) {
    case types.CLICK_ADDRESS:
      return {
        ...state,
        selected: action.address
      };

    case types.FETCH_SUCCESS_ADDRESS:
      return {
        ...state,
        list: action.addresses
      };

    default:
      return state;
  }
}
