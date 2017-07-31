import config from "./config";
import * as actions from "./components/addresses/actions";
import axios from "axios";

export const dayOrder = {
  Sunday: "Niedziela",
  Monday: "Poniedziałek",
  Tuesday: "Wtorek",
  Wednesday: "Środa",
  Thursday: "Czwartek",
  Friday: "Piątek",
  Saturday: "Sobota"
};
export const cleanupAddressData = addresses => {
  let id = 1;
  return addresses.reduce(
    (ret, a) => {
      ret.addresses.push({
        id,
        address: a.adres,
        hours: Object.keys(dayOrder).map(day => {
          return {
            day: dayOrder[day],
            hours: (a.godziny && a.godziny[0] && a.godziny[0][day]) ||
              "Brak danych"
          };
        }),
        name: a.siec,
        lat: a.latitude,
        lng: a.longitude,
        icon: a.logo
      });
      ret.markers.push({
        id,
        icon: a.logo,
        lat: a.latitude,
        lng: a.longitude
      });
      id++;
      return ret;
    },
    {
      addresses: [],
      markers: []
    }
  );
};

export const apiAddress = {
  fetchPromise: function() {
    return axios.get(`${config.ADDRESS_SOURCE_URL}`);
  },
  fetch: function(store) {
    store.dispatch(actions.fetchAddressRequest());
    return this.fetchPromise()
      .then(r => r.data)
      .then(json => {
        store.dispatch(actions.fetchAddressSuccess(cleanupAddressData(json)));
        return json;
      })
      .catch(function(error) {
        store.dispatch(actions.fetchAddressError(error));
      });
  }
};
