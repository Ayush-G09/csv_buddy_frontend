export const setMode = (mode) => ({
  type: "SET_MODE",
  payload: mode,
});

export const setIsUserLoggedIn = (isLoggedIn) => ({
  type: "SET_IS_USER_LOGGED_IN",
  payload: isLoggedIn,
});

export const setDocs = (docs) => ({
  type: "SET_DOCS",
  payload: docs,
});
