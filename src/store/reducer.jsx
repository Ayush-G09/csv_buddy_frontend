import { checkAuthToken } from "../utils";

const initialState = {
  mode: localStorage.getItem("mode") || "light",
  isUserLoggedIn: checkAuthToken(),
  docs: [],
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_IS_USER_LOGGED_IN":
      return { ...state, isUserLoggedIn: action.payload };
    case "SET_DOCS":
      return { ...state, docs: action.payload };
    default:
      return state;
  }
};

export default themeReducer;
