import { combineReducers, createStore } from "redux";
import addressListReducer from "./components/addresses/reducers";
import addressMapReducer from "./components/addressmap/reducers";

const rootReducer = combineReducers({
  addresses: addressListReducer,
  map: addressMapReducer
});

export default createStore(rootReducer);
