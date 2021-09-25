import React, { useState } from "react";
import {

  Row,
  Col,
  Button,
 
} from "reactstrap";


import i18next from "i18next";

import PreparedMode from "./OwnerOrderDetail/PreparedMode";
import AssignToDriver from "./AssignToDriver";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import Loader from "../../common/Loader"

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";



let token = null;
let pageLinks = [];
let numberOfPages = 0;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};


class ActionOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prepareShow: false,
      AssignDriverModal: false,
      driverData: [],
      // LoaderShow: true,
    };
  }


  getAllDriver = async() => {
    const response = await instance.get(requests.fetchGetAllDriverForOwner,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .catch((error) => {
      let errorMessage = error.response.data.error.message;
      console.log(errorMessage);
      NotificationManager.error(errorMessage);
    });

    if(response && response.data){
      this.setState({driverData: response.data.data})
    }
  }

  componentDidMount =() => { 
      this.getAllDriver()
  }

  handleModalP = () => {
    this.setState({ prepareShow: true });
  };

  prepareClose = () => {
    this.setState({ prepareShow: false });
  };

  handleModalA = () => {
    this.setState({ AssignDriverModal: true });
  };

  AssignDriverClose = () => {
    this.setState({ AssignDriverModal: false });
  };

  render() {
    return (
      <>
        <td>
          {this.props.last_status === "Just Created" ? (
            <>
              <Row>
                <Col>
                  <Button
                    className="mt-1 btn-md btn-block"
                    color="success"
                    type="button"
                    onClick={
                      this.props.detailsPage == true
                        ? this.handleModalP
                        : () => {
                            this.props.onActionMethod(
                              this.props.owner_id,
                              "Accepted by Restaurant", 
                              null
                            );
                          }
                    }
                  >
                    {i18next.t("Accept")}
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="mt-1 btn-md btn-block"
                    color="danger"
                    type="button"
                    onClick={() =>
                      this.props.onActionMethod(
                        this.props.owner_id,
                        "Rejected by Restaurant", null
                      )
                    }
                  >
                    {i18next.t("Reject")}
                  </Button>
                </Col>
              </Row>
              <PreparedMode
                onshow={this.state.prepareShow}
                onClose={this.prepareClose}
                id={this.props.owner_id}
                passData={this.props.onActionMethod}
              />
            </>
          ) : this.props.last_status === "Rejected by Restaurant" ? (
            i18next.t("No actions for you right now!")
          ) : this.props.last_status === "Accepted by Restaurant" ? (
            <>
              <Col>
                <Button
                  className="my-2 btn-md btn-block"
                  color="primary"
                  type="button"
                  onClick={() =>
                    this.props.onActionMethod(this.props.owner_id, "Prepared", null)
                  }
                >
                  {i18next.t("Prepared")}
                </Button>
              </Col>
            </>
          ) : this.props.last_status === "Prepared" &&
            this.props.is_delivery === false ? (
            <>
              <Col>
                <Button
                  className="my-2 btn-md btn-block"
                  color="primary"
                  type="button"
                  onClick={() =>
                    this.props.onActionMethod(this.props.owner_id, "Delivered")
                  }
                >
                  {i18next.t("Delivered")}
                </Button>
              </Col>
            </>
          ) : this.props.last_status === "Prepared" &&
            this.props.is_delivery === true ? (
            <>
              <Col>
                <Button
                  className="my-2 btn-md btn-block"
                  color="primary"
                  type="button"
                  onClick={this.handleModalA}
                >
                  {i18next.t("Assign Driver")}
                </Button>
              </Col>
              <AssignToDriver
                onshow={this.state.AssignDriverModal}
                onClose={this.AssignDriverClose}
                passData={this.props.onActionMethod}
                id={this.props.owner_id}
                driverData={this.state.driverData}
              />
            </>
          ) : this.props.last_status === "Delivered" ? (
            i18next.t("No actions for you right now!")
          ) : (
            i18next.t("No actions for you right now!")
          )}
        </td>
        {/* <Loader open={this.state.LoaderShow} /> */}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionOrder);
