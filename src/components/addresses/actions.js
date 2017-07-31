import actionTypes from "./actionTypes";

export const clickAddress = address => {
  return {
    type: actionTypes.CLICK_ADDRESS,
    address
  };
};

export const fetchAddressRequest = () => {
  return {
    type: actionTypes.FETCH_REQUEST_ADDRESS,
    fetching: true
  };
};

export const fetchAddressError = errMsg => {
  return {
    type: actionTypes.FETCH_ERROR_ADDRESS,
    fetching: false,
    err: errMsg
  };
};

export const fetchAddressSuccess = res => {
  return {
    type: actionTypes.FETCH_SUCCESS_ADDRESS,
    fetching: false,
    addresses: res.addresses,
    markers: res.markers
  };
};
