import actionTypes from "./actionTypes";

export const clickAddress = address => {
  return {
    type: actionTypes.CLICK_ADDRESS,
    address
  };
};
