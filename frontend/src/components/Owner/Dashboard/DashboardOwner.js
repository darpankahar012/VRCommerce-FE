import React, { Component } from "react";
import HeaderOwner from "./HeaderOwner";

// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import i18next from "i18next";
// reactstrap components
import { Card, CardHeader, CardBody, Container, Row, Col } from "reactstrap";

// core components
import { chartOptions, parseOptions } from "variables/charts.js";

import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import Loader from "../../common/Loader";
// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let token = null;
let userData = {};
const mapStateToProps = (state) => {
  userData = state.userData;
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class DashboardOwner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      stateCard: [],
      LoaderShow: true,
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  getDashBoardDetail = async () => {
    const response = await instance
      .get(requests.fetchDashBoardDetail, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        console.log(errorMessage);
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      const cardData = [
        {
          cardTitle: i18next.t("ORDERS ( 30 DAYS )"),
          state_value:
            response.data.data[0].stats.length === 0
              ? 0
              : response.data.data[0].stats[0].hasOwnProperty("orders") === true
              ? response.data.data[0].stats[0].orders
              : "",
          icon: "fas fa-chart-bar",
          color: "bg-danger",
        },
        {
          cardTitle: i18next.t("SALES VOLUME ( 30 DAYS )"),
          state_value:
            response.data.data[0].stats.length === 0
              ? 0
              : response.data.data[0].stats[0].hasOwnProperty(
                  "sales_volume"
                ) === true
              ? userData.currencies.symbol +
                " " +
                parseFloat(
                  response.data.data[0].stats[0].sales_volume.toFixed(2)
                )
              : "",
          icon: "fas fa-chart-pie",
          color: "bg-warning",
        },
        {
          cardTitle: i18next.t("ORDERS FROM"),
          state_value:
            response.data.data[0].orders_from.length === 0
              ? 0
              : `${response.data.data[0].orders_from[0].unique_users}`,
          icon: "fas fa-users",
          color: "bg-yellow",
        },
        {
          cardTitle: i18next.t("EXPOSURE TO"),
          state_value:
            response.data.data[0].exposer_to.length === 0
              ? 0
              : response.data.data[0].exposer_to[0].exposer_to,
          icon: "fas fa-percent",
          color: "bg-info",
        },
      ];

      const a = [];
      var d = new Date();
      var n = d.getMonth();
      for (let i = 1; i <= 12; i++) {
        if (i - 1 > n) {
          a[i - 1] = null;
        } else {
          a[i - 1] = 0;
        }

        response.data.data[0].sales_value.map((item, index) => {
          if (i === item._id) {
            a[item._id - 1] = item.monthly_sales;
          }
        });
      }

      const Linedata = {
        labels: [
          i18next.t("Jan"),
          i18next.t("Feb"),
          i18next.t("Mar"),
          i18next.t("Apr"),
          i18next.t("May"),
          i18next.t("Jun"),
          i18next.t("Jul"),
          i18next.t("Aug"),
          i18next.t("Sep"),
          i18next.t("Oct"),
          i18next.t("Nov"),
          i18next.t("Dec"),
        ],
        datasets: [
          {
            data: a,
          },
        ],
      };
      const b = [];
      for (let i = 1; i <= 12; i++) {
        b[i - 1] = 0;
        response.data.data[0].total_orders.map((item, index) => {
          if (i === item._id) {
            b[item._id - 1] = item.monthly_order;
          }
        });
      }
      const bardata = {
        labels: [
          i18next.t("Jan"),
          i18next.t("Feb"),
          i18next.t("Mar"),
          i18next.t("Apr"),
          i18next.t("May"),
          i18next.t("Jun"),
          i18next.t("Jul"),
          i18next.t("Aug"),
          i18next.t("Sep"),
          i18next.t("Oct"),
          i18next.t("Nov"),
          i18next.t("Dec"),
        ],
        datasets: [
          {
            data: b,
          },
        ],
      };

      const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                precision: 0,
                callback: (value, index, values) => {
                  return userData.currencies.symbol + value;
                },
              },
            },
          ],
        },
      };

      const baroptions = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                precision: 0,
                callback: (value, index, values) => {
                  return value;
                },
              },
            },
          ],
        },
      };

      this.setState(
        {
          stateCard: cardData,
          Linedata: Linedata,
          options: options,
          baroptions: baroptions,
          bardata: bardata,
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  };

  componentDidMount = () => {
    // if (this.state.LoaderShow === true) {
    //   this.getDashBoardDetail();
    // }
  };

  render() {
    const currencies = userData.hasOwnProperty("currencies")
      ? userData.currencies.symbol
      : "";
    return (
      <>
        {/* <Loader open={this.state.LoaderShow} /> */}
        <HeaderOwner states={this.state.stateCard} currencies={currencies} />
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        {i18next.t("Overview")}
                      </h6>
                      <h2 className="text-white mb-0">
                        {i18next.t("Sales value")}
                      </h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Line
                      data={this.state.Linedata}
                      options={this.state.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        {i18next.t("Performance")}
                      </h6>
                      <h2 className="mb-0">{i18next.t("Total orders")}</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={this.state.bardata}
                      options={this.state.baroptions}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <NotificationContainer />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardOwner);
