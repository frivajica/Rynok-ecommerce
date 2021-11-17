import { configureStore } from "@reduxjs/toolkit"; // import redux tool-kit
import logger from "redux-logger"; // import redux logger
import authReducer from "./auth";
import userReducer from "./user";
import productReducer from "./product";
import reviewReducer from "./review";
import orderReducer from "./order";

// config reducer

const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    const customizedMiddleware = getDefaultMiddleware({
      serializableCheck: false,
    });
    return customizedMiddleware.concat(logger);
  },
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    review: reviewReducer,
    order: orderReducer,
  },
});

export default store;
