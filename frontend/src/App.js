import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import instance from "./axios";
import requests from "./requests";
// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "./redux/bindActionCreator";
import { connect } from "react-redux";

import Home from "./components/common/Home/home";
import Login from "./components/common/login/Login.js";
import Forgot from "./components/common/forgotPassword/ForgotPassword";
import ClientRegistration from "./components/common/signUp/ClientRegistration";
import ResetPassword from "./components/common/resetPassword/ResetPassword";
import AdminRoutes from "./components/Dashboard/Admin";
import Details from "./components/Dashboard/Pages/Details.js";
import OwnerRegistration from "components/Dashboard/Pages/Restaurants/OwnerRegistration.js";
import ResturantRegistration from "./components/common/OwnerRgistration/ResturantRegistration";
import otpVerification from "./components/common/otpVerification/otpVerification";
import Profile from "./components/MyProfile/Profile.js";
import SuccesPayPage from "./components/succesPayPage/succesPay";

// Diriver
import DriverRegistration from "./components/Dashboard/Pages/Driver/DriverRegistration";
import DriverEdit from "./components/Dashboard/Pages/Driver/DriverEdit";

// Addmin side City
import CityRegistration from "components/Dashboard/Pages/City/CityRegistration";
import CityEdit from "components/Dashboard/Pages/City/CityEdit";

import PageNew from "./components/Dashboard/Pages/PagesFooterLink/PageNew";
import CityResturant from "./components/common/Home/CityResturant";
import Restaurant from "./components/common/Home/ResturantDish";
import EditVarient from "./components/Owner/Menu/EditMenu/EditVarient";
import UpdateItem from "./components/Owner/Menu/EditMenu/UpdateItem";
import AddNewVariant from "./components/Owner/Menu/EditMenu/AddNewVariant";
import EditNewVariant from "./components/Owner/Menu/EditMenu/EditNewVariant";
import PageEdit from "./components/Dashboard/Pages/PagesFooterLink/PageEdit";
import FooterLink from "./components/Footers/Footer Link/FooterLink";
import updateRestaurant from "./components/Dashboard/Pages/Restaurants/UpdateRestaurant";
import OrderOwner from "./components/Owner/Order/OwnerOrderDetail/OrderDetail";
import Checkout from "./components/CheckoutPayment/Checkout";
import ConnectStripe from "./components/Owner/Finance/ConnectStripe";
import InjectedCheckoutForm from "./components/CheckoutPayment/Stripe/CheckoutForm";
import OrderDetailClient from "./components/Client/OrderDetailClient";
import { messaging } from "./firebase";
import "./i18n";
import i18next from "i18next";
import { NewSubscriptionPlan } from "components/Dashboard/Pages/SubScriptionPlan/NewSubscriptionPlan";
import StripePlan from "components/common/OwnerRgistration/StripePlan";
import ExplorePlan from "./components/Owner/SubscriptionPlan/ExplorePlan/ExpolrePlan";
import UpdateStripe from "./components/updateStripe/updateStripe";

let token = null;
let get_fcm_registration_token = null;
const mapStateToProps = (state) => {
  token = state.token;
  get_fcm_registration_token = state.get_fcm_registration_token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    const lang = localStorage.getItem("lang") || "en";
    i18next.changeLanguage(lang);
    if (token === null) {
      return null;
    } else {
      if (messaging) {
        messaging
          .requestPermission()
          .then(() => {
            return messaging.getToken();
          })
          .then((fcmToken) => {
            this.setState(
              { fcm_registration_token: fcmToken, fcm_flag: false },
              async () => {
                const data = {
                  fcm_regi_token: true,
                  fcm_deprecated_token: get_fcm_registration_token,
                  fcm_registration_token: this.state.fcm_registration_token,
                };
                const response = await instance
                  .post(requests.fetchRefreshFcmToken, data, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .catch((error) => {
                    let errorMessage = error.response.data.error.message;
                    NotificationManager.error(errorMessage);
                  });
                if (response && response.data) {
                  const rToken = this.state.fcm_registration_token;
                  this.props.GET_FCM_REGISTRATION_TOKEN(rToken);
                  const userData = response.data.data.user;
                  this.props.LOGIN_USER_DETAIL(userData);
                }
              }
            );
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} />} />
          <Route exact path="/login" render={(props) => <Login {...props} />} />
          <Route
            exact
            path="/plans"
            render={(props) => <StripePlan {...props} />}
          />
          <Route
            path="/forgotPassword"
            render={(props) => <Forgot {...props} />}
          />
          <Route
            path="/signUp"
            render={(props) => <ClientRegistration {...props} />}
          />
          <Route
            path="/resetPassword"
            render={(props) => <ResetPassword {...props} />}
          />
          <Route path="/admin/orderdetail/:id" component={Details} />
          <Route
            exact
            path="/Create"
            render={(props) => <OwnerRegistration {...props} />}
          />
          <Route exact path="/Registration" component={ResturantRegistration} />
          <Route exact path="/otpVerification" component={otpVerification} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/CheckoutForm" component={InjectedCheckoutForm} />
          <Route
            exact
            path="/drivers/create"
            render={(props) => <DriverRegistration {...props} />}
          />
          <Route
            exact
            path="/subscriptionPlan/create"
            render={(props) => <NewSubscriptionPlan {...props} />}
          />
          <Route
            exact
            path="/client/orders/detail/:id"
            component={OrderDetailClient}
          />
          <Route
            exact
            path="/cities/create"
            render={(props) => <CityRegistration {...props} />}
          />
          <Route exact path="/cart-checkout" render={(props) => <Checkout />} />
          <Route
            exact
            path="/pages/create"
            render={(props) => <PageNew {...props} />}
          />
          <Route
            path="/subscriptionPlan/explorePlan"
            render={(props) => <ExplorePlan {...props} />}
          />
          <Route exact path="/pages/edit/:id" component={PageEdit} />
          <Route exact path="/pages/:id" component={FooterLink} />
          <Route exact path="/driver/edit/:id" component={DriverEdit} />
          <Route exact path="/city/edit/:id" component={CityEdit} />
          <Route exact path="/menu/item/edit/:id" component={UpdateItem} />
          <Route
            exact
            path="/menu/item/edit/variant/:id"
            component={EditVarient}
          />
          <Route
            exact
            path="/menu/item/edit/variant/create/:id"
            component={AddNewVariant}
          />
          <Route
            exact
            path="/menu/item/edit/variant/edit/:id"
            component={EditNewVariant}
          />
          <Route exact path="/city/:name" component={CityResturant} />
          <Route
            exact
            path="/restaurant/:restaurantName"
            component={Restaurant}
          />
          <Route exact path="/orders/detail/:id" component={OrderOwner} />
          <Route
            exact
            path="/update/restaurants/:id"
            component={updateRestaurant}
          />{" "}
          <Route
            exact
            path="/updateStripe"
            render={(props) => <UpdateStripe {...props} />}
          />
          <Route exact path="/connectstripe" component={ConnectStripe} />
          <Route exact path="/succes" component={SuccesPayPage} />
          <AdminRoutes />
          <Redirect from="/" to="/" />
        </Switch>
      </Router>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
