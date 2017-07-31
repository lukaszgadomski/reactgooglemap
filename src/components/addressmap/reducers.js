import initialState from "../../storeInitialState";
import types from "./actionTypes";

export default function addressmap(state = initialState.map, action) {
  switch (action.type) {
    case types.CLICK_ADDRESS:
      return {
        ...state,
        infowindow: action.address,
        center: {
          lat: action.address.lat,
          lng: action.address.lng
        }
      };

    case types.FETCH_SUCCESS_ADDRESS:
      return {
        ...state,
        markers: action.addresses
      };

    default:
      return state;
  }
}
