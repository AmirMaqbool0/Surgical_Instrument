import { configureStore } from "@reduxjs/toolkit";
import registerUserReducer from "./Auth/registerUserSlice";
import loginUserReducer from "./Auth/loginUserSlice";
import sendOtpReducer from "./Auth/otpSlice";
import otpCheckReducer from "./Auth/otpCheckSlice";
import resetPasswordReducer from "./Auth/resetPasswordSlice";
import instrumentCategoryReducer from "./instrumentCategorySlice";
import categoryProductReducer from "./categoryProductSlice";
import singleProductReducer from "./singleProductSlice";
import cartReducer from "./cartSlice";
import relatedProductsReducers from "./relatedProductsSlice";
import reviewReducer from "./reviewSlice";
import featuredProductsReducer from "./featuredProductsSlice";
import newsEventsReducer from "./newsEventSlice";
import orderReducer from "./orderSlice";
import bundleReducer from "./bundleSlice";
import singleBundleReducer from "./singleBundleSlice";
import dashboardReducer from "./Account/dashboardSlice";
import latestOrderReducer from "./Account/latestOrderSlice";
import orderListReducer from "./Account/orderListSlice";
import changePasswordReducer from "./Account/changePasswordSlice";
import profileUpdateReducer from "./Account/profileUpdateSlice";
const store = configureStore({
  reducer: {
    registerUser: registerUserReducer,
    loginUser: loginUserReducer,
    otp: sendOtpReducer,
    otpCheck: otpCheckReducer,
    resetPassword: resetPasswordReducer,
    instrumentCategory: instrumentCategoryReducer,
    categoryProduct: categoryProductReducer,
    singleProduct: singleProductReducer,
    cart: cartReducer,
    relatedProducts: relatedProductsReducers,
    review: reviewReducer,
    featuredProducts: featuredProductsReducer,
    newsEvents: newsEventsReducer,
    order: orderReducer,
    bundle: bundleReducer,
    singleBundle: singleBundleReducer,
    dashboard: dashboardReducer,
    latestOrder: latestOrderReducer,
    orderList: orderListReducer,
    changePassword: changePasswordReducer,
    profileUpdate: profileUpdateReducer,
  },
});

export default store;
