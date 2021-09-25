import React, { Component } from "react";
import Loader from "../../common/Loader";
import instance from "../../../axios";
import requests from "../../../requests";
// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";


let token = null;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class ConnectStripe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LoaderShow: true,
    };
  }

  componentDidMount = async () => {
    let searchParams = this.props.history.location.search; // history.location.search

    const response = await instance
      .get(
          `${requests.fetchConnectStripeOAuth}${searchParams}`
          , {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error;
        console.log(errorMessage);
        //   NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      console.log(response);
      const { history } = this.props;
      if (history) {
        history.push("/finance");
      }
    }
  };

  render() {
    return (
      <>
        <Loader open={this.state.LoaderShow} />
        <NotificationContainer />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectStripe);
