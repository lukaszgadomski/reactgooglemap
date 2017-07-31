import * as actions from "./actions";
import types from "./ActionTypes";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { apiAddress } from "../../api";
import sinon from "sinon";

const rawAddressData = [
  {
    adres: "Warszawa, ul. Grzybowska 37",
    godziny: [
      {
        Friday: "10:00 - 19:00",
        Monday: "10:00 - 19:00",
        Saturday: "brak danych",
        Sunday: "brak danych",
        Thursday: "10:00 - 19:00",
        Tuesday: "10:00 - 19:00",
        Wednesday: "10:00 - 19:00"
      }
    ],
    latitude: "52.2351646",
    logo: "https://static.okazjum.pl/storage/okazjum/uploads/uploads/contractor/logo/6/s3_logo_alsen_siec-handlowa.jpg",
    longitude: "20.9942039",
    siec: "Alsen"
  },
  {
    adres: "Warszawa, al. Jana Pawła II 52/54",
    godziny: [
      {
        Friday: "24h",
        Monday: "24h",
        Saturday: "24h",
        Sunday: "24h",
        Thursday: "24h",
        Tuesday: "24h",
        Wednesday: "24h"
      }
    ],
    latitude: "52.2446115",
    logo: "https://static.okazjum.pl/storage/okazjum/uploads/uploads/contractor/logo/120/s3_logo_apteka1_siec-handlowa.jpg",
    longitude: "20.9919215",
    siec: "Apteka1"
  }
];

const processedData = {
  addresses: [
    {
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
    },
    {
      id: 2,
      address: "Warszawa, al. Jana Pawła II 52/54",
      hours: [
        { day: "Niedziela", hours: "24h" },
        { day: "Poniedziałek", hours: "24h" },
        { day: "Wtorek", hours: "24h" },
        { day: "Środa", hours: "24h" },
        { day: "Czwartek", hours: "24h" },
        { day: "Piątek", hours: "24h" },
        { day: "Sobota", hours: "24h" }
      ],
      name: "Apteka1",
      lat: "52.2446115",
      lng: "20.9919215"
    }
  ],
  markers: [
    {
      id: 1,
      icon: "https://static.okazjum.pl/storage/okazjum/uploads/uploads/contractor/logo/6/s3_logo_alsen_siec-handlowa.jpg",
      lat: "52.2351646",
      lng: "20.9942039"
    },
    {
      id: 2,
      icon: "https://static.okazjum.pl/storage/okazjum/uploads/uploads/contractor/logo/120/s3_logo_apteka1_siec-handlowa.jpg",
      lat: "52.2446115",
      lng: "20.9919215"
    }
  ]
};
describe("synchronous map actions", () => {
  it("should create an click action to center map and highlight address on list", () => {
    const given = {
      id: 2,
      address: "Warszawa, al. Jana Pawła II 52/54",
      hours: [
        { day: "Niedziela", hours: "24h" },
        { day: "Poniedziałek", hours: "24h" },
        { day: "Wtorek", hours: "24h" },
        { day: "Środa", hours: "24h" },
        { day: "Czwartek", hours: "24h" },
        { day: "Piątek", hours: "24h" },
        { day: "Sobota", hours: "24h" }
      ],
      name: "Apteka1",
      lat: "52.2446115",
      lng: "20.9919215"
    };

    expect(actions.clickAddress(given)).toMatchSnapshot();
  });

  it("should create action fetch address", () => {
    const given = {
      type: types.FETCH_REQUEST_ADDRESS
    };
    expect(actions.fetchAddressRequest()).toMatchSnapshot();
  });

  it("should create action fetch error address", () => {
    const givenErr = "Timeout";
    const expected = {
      type: types.FETCH_ERROR_ADDRESS,
      fetching: false,
      err: "Timeout"
    };
    expect(actions.fetchAddressError(givenErr)).toMatchSnapshot();
  });

  it("should create action fetch success address", () => {
    const given = processedData;
    const expected = {
      type: types.FETCH_SUCCESS_ADDRESS,
      fetching: false,
      addresses: given.addresses,
      markers: given.markers
    };
    expect(actions.fetchAddressSuccess(given)).toMatchSnapshot();
  });
});

describe("async fetch actions", () => {
  it(`creates correct actions on address api fetch`, () => {
    const given = processedData;
    const expectedActions = [
      {
        type: types.FETCH_REQUEST_ADDRESS,
        fetching: true
      },
      {
        type: types.FETCH_SUCCESS_ADDRESS,
        fetching: false,
        addresses: given.addresses,
        markers: given.markers
      }
    ];
    const mockStore = configureStore([]);
    const store = mockStore({});

    const callback = sinon
      .stub(apiAddress, "fetchPromise")
      .callsFake(function fakeFn() {
        return Promise.resolve({ data: rawAddressData });
      });

    return apiAddress.fetch(store).then(() => {
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
