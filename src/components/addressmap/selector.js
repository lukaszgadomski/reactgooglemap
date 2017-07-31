import { createSelector } from "reselect";

const getAddresses = state => state.addresses;

export const getMarkersDataFromAddress = createSelector(
  [getAddresses],
  addresses => {
    return addresses.map(({ lat, lng, logo }) => {
      return { icon: logo, lat, lng };
    });
  }
);
