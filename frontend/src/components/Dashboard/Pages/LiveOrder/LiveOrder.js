import React from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Modal,
  ButtonGroup,
  Badge,
} from "reactstrap";

import i18next from "i18next";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../../axios";
import requests from "../../../../requests";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import classnames from "classnames";
import Moment from "react-moment";

let token = null;
let flag = true;
const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class LiveOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NewOrder: [],
      AcceptedOrder: [],
      PreparedOrder: [],
      PickedUpOrder: [],
      RejectedbyRestaurant: [],
      Delivered: [],
      tabs: 1,
      flag: true,
    };
  }

  handleRefreshPage = () => {
    this.getLiveOrders();
  };

  getLiveOrders = async () => {
    ///alert("Call Get Live Data Function "+flag)
    const response = await instance
      .get(requests.fetchLiveOrdersForAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      response.data.data.map((data, i) => {
        if (data._id === "Just Created") {
          this.setState({
            NewOrder: data.orders,
          });
        } else if (data._id === "Accepted by Restaurant") {
          this.setState({
            AcceptedOrder: data.orders,
          });
        } else if (data._id === "Prepared") {
          this.setState({
            PreparedOrder: data.orders,
          });
        } else if (data._id === "Picked Up") {
          this.setState({
            PickedUpOrder: data.orders,
          });
        } else if (data._id === "Delivered") {
          this.setState({
            Delivered: data.orders,
          });
        } else if (data._id === "Rejected by Restaurant") {
          this.setState({
            RejectedbyRestaurant: data.orders,
          });
        }
      });
    }
  };

  componentDidMount = () => {
    this.getLiveOrders();
  };

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };

  handleMovetoODetail = (O_id, index) => {
    this.props.ALL_ID({ O_id });
    const { history } = this.props;
    if (history) {
      history.push(`/admin/orderdetail/${index}`);
    }
  };

  render() {
    let {
      NewOrder,
      AcceptedOrder,
      PreparedOrder,
      Delivered,
      RejectedbyRestaurant,
      PickedUpOrder,
    } = this.state;
    return (
      <>
        {/* <Header /> */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <br />
              <br />
              {/* <h1 className="btn btn-outline-primary " data-toggle="button" aria-pressed="true" active="true" > Live Orders </h1> */}
              <Row>
                <Col>
                  <Nav
                    // className="nav-fill flex-column flex-md-row tabbable sticky "
                    className="tabbable sticky "
                    id="tabs-icons-text"
                    pills
                    role="tablist"
                  >
                    <NavItem>
                      <Button
                        aria-selected={this.state.tabs === 1}
                        className={classnames("", {
                          active: this.state.tabs === 1,
                        })}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => this.toggleNavs(e, "tabs", 1)}
                        role="tab"
                        color="default"
                        outline
                      >
                        {i18next.t("New Orders")}
                      </Button>
                    </NavItem>
                    <NavItem>
                      <Button
                        aria-selected={this.state.tabs === 2}
                        className={classnames("nav-item nav-item-category", {
                          active: this.state.tabs === 2,
                        })}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => this.toggleNavs(e, "tabs", 2)}
                        role="tab"
                        color="default"
                        outline
                      >
                        {i18next.t("Prepared Orders")}
                      </Button>
                    </NavItem>
                    <NavItem>
                      <Button
                        aria-selected={this.state.tabs === 3}
                        className={classnames("nav-item nav-item-category", {
                          active: this.state.tabs === 3,
                        })}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => this.toggleNavs(e, "tabs", 3)}
                        role="tab"
                        color="default"
                        outline
                      >
                        {i18next.t("Done")}
                      </Button>
                    </NavItem>
                  </Nav>
                </Col>
                <Col className="mr-1">
                  <Button
                    className={classnames("nav-item nav-item-category")}
                    style={{ cursor: "pointer", float: "right" }}
                    onClick={this.handleRefreshPage}
                    role="tab"
                    color="default"
                    outline
                  >
                    {i18next.t("refresh")}
                  </Button>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        <TabContent activeTab={this.state.tabs} sm={12} md={12} xl={12} xs={12}>
          <TabPane tabId={1}>
            <Container className="mt--7" fluid>
              <Row>
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                    <CardHeader className="text-left ">
                      <h2 className="h3 mb-0">{i18next.t("New Orders")}</h2>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div>
                        {NewOrder.map((item, index) => (
                          <div>
                            <div>
                              <small>{item.last_status}</small>
                            </div>
                            <div>
                              <small>
                                <Moment format="Do MMM YYYY, hh:mm">
                                  {item.createdAt}
                                </Moment>
                              </small>
                            </div>
                            <div
                              style={{
                                "justify-content": "space-between",
                                display: "flex",
                              }}
                            >
                              <Badge color="success">
                                {item.o_id} {item.owner_name.name}
                              </Badge>
                              <button
                                onClick={() => {
                                  this.handleMovetoODetail(
                                    item.order_id,
                                    index
                                  );
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                {i18next.t("Details")}
                              </button>
                            </div>
                            <div>
                              <small>{item.client_name.name}</small>
                            </div>
                            <div>
                              <small>{item.total}</small>
                            </div>
                            {index != NewOrder.length - 1 && <hr />}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                    <CardHeader className="text-left ">
                      <h2 className="h3 mb-0">{i18next.t("Accepted")}</h2>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div>
                        {AcceptedOrder.map((item, index) => (
                          <div>
                            <div>
                              <small>{item.last_status}</small>
                            </div>
                            <div>
                              <small>
                                <Moment format="Do MMM YYYY, hh:mm">
                                  {item.createdAt}
                                </Moment>
                              </small>
                            </div>
                            <div
                              style={{
                                "justify-content": "space-between",
                                display: "flex",
                              }}
                            >
                              <Badge color="success">
                                {item.o_id} {item.owner_name.name}
                              </Badge>
                              <button
                                onClick={() => {
                                  this.handleMovetoODetail(
                                    item.order_id,
                                    index
                                  );
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                {i18next.t("Details")}
                              </button>
                            </div>
                            <div>
                              <small>{item.client_name.name}</small>
                            </div>
                            <div>
                              <small>{item.total}</small>
                            </div>
                            {index != AcceptedOrder.length - 1 && <hr />}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </TabPane>

          <TabPane tabId={2}>
            <Container className="mt--7" fluid>
              <Row>
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                    <CardHeader className="text-left ">
                      <h2 className="h3 mb-0">{i18next.t("Prepared")}</h2>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div>
                        {PreparedOrder.map((item, index) => (
                          <div>
                            <div>
                              <small>{item.last_status}</small>
                            </div>
                            <div>
                              <small>
                                <Moment format="Do MMM YYYY, hh:mm">
                                  {item.createdAt}
                                </Moment>
                              </small>
                            </div>
                            <div
                              style={{
                                "justify-content": "space-between",
                                display: "flex",
                              }}
                            >
                              <Badge color="success">
                                {item.o_id} {item.owner_name.name}
                              </Badge>
                              <button
                                onClick={() => {
                                  this.handleMovetoODetail(
                                    item.order_id,
                                    index
                                  );
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                {i18next.t("Details")}
                              </button>
                            </div>
                            <div>
                              <small>{item.client_name.name}</small>
                            </div>
                            <div>
                              <small>{item.total}</small>
                            </div>
                            {index != PreparedOrder.length - 1 && <hr />}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                    <CardHeader className="text-left ">
                      <h2 className="h3 mb-0">{i18next.t("Picked Up")}</h2>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div>
                        {PickedUpOrder.map((item, index) => (
                          <div>
                            <div>
                              <small>{item.last_status}</small>
                            </div>
                            <div>
                              <small>
                                <Moment format="Do MMM YYYY, hh:mm">
                                  {item.createdAt}
                                </Moment>
                              </small>
                            </div>
                            <div
                              style={{
                                "justify-content": "space-between",
                                display: "flex",
                              }}
                            >
                              <Badge color="success">
                                {item.o_id} {item.owner_name.name}
                              </Badge>
                              <button
                                onClick={() => {
                                  this.handleMovetoODetail(
                                    item.order_id,
                                    index
                                  );
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                {i18next.t("Details")}
                              </button>
                            </div>
                            <div>
                              <small>{item.client_name.name}</small>
                            </div>
                            <div>
                              <small>{item.total}</small>
                            </div>
                            {index != PickedUpOrder.length - 1 && <hr />}
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </TabPane>

          <TabPane tabId={3}>
            <Container className="mt--7" fluid>
              <Row>
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                    <CardHeader className="text-left ">
                      <h2 className="h3 mb-0">{i18next.t("Delivered")}</h2>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div>
                        {Delivered.map((item, index) => (
                          <div>
                            <div>
                              <small>{item.last_status}</small>
                            </div>
                            <div>
                              <small>
                                <Moment format="Do MMM YYYY, hh:mm">
                                  {item.createdAt}
                                </Moment>
                              </small>
                            </div>
                            <div
                              style={{
                                "justify-content": "space-between",
                                display: "flex",
                              }}
                            >
                              <Badge color="success">
                                {item.o_id} {item.owner_name.name}
                              </Badge>
                              <button
                                onClick={() => {
                                  this.handleMovetoODetail(
                                    item.order_id,
                                    index
                                  );
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                {i18next.t("Details")}
                              </button>
                            </div>
                            <div>
                              <small>{item.client_name.name}</small>
                            </div>
                            <div>
                              <small>{item.total}</small>
                            </div>
                            <hr />
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                <Col className="order-xl-2 mb-5 mb-xl-0" xl="6">
                  <Card className="card-profile shadow">
                    <CardHeader className="text-left ">
                      <h2 className="h3 mb-0">{i18next.t("Rejected")}</h2>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <div>
                        {RejectedbyRestaurant.map((item, index) => (
                          <div>
                            <div>
                              <small>{item.last_status}</small>
                            </div>
                            <div>
                              <small>
                                <Moment format="Do MMM YYYY, hh:mm">
                                  {item.createdAt}
                                </Moment>
                              </small>
                            </div>
                            <div
                              style={{
                                "justify-content": "space-between",
                                display: "flex",
                              }}
                            >
                              <Badge color="success">
                                {item.o_id} {item.owner_name.name}
                              </Badge>
                              <button
                                onClick={() => {
                                  this.handleMovetoODetail(
                                    item.order_id,
                                    index
                                  );
                                }}
                                className="btn btn-sm btn-primary"
                              >
                                {i18next.t("Details")}
                              </button>
                            </div>
                            <div>
                              <small>{item.client_name.name}</small>
                            </div>
                            <div>
                              <small>{item.total}</small>
                            </div>
                            <hr />
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </TabPane>
        </TabContent>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveOrder);
