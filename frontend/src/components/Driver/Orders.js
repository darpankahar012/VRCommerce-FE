import React from "react";
// react plugin used to create google maps
import i18next from "i18next";
import { messaging } from "../../firebase";
import Moment from "react-moment";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Form,
  Badge,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";
// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import instance from "../../axios";
import requests from "../../requests";
// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator";
import { connect } from "react-redux";
import Loader from "../common/Loader";
import ReactDatetime from "react-datetime";

let token = null;
let pageLinks = [];
let numberOfPages = 0;
let get_fcm_registration_token = null;

const mapStateToProps = (state) => {
  token = state.token;
  get_fcm_registration_token = state.get_fcm_registration_token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
      dateFrom: "",
      dateTo: "",
      Restaurant: "",
      Client: "",
      LoaderShow: true,
      datas: [],
      ownerData: [],
      currentPage: 1,
      total: 10,
    };
  }
  handleDateFromChange = (newDate) => {
    this.setState({
      dateFrom: newDate,
    });
  };
  handleDateToChange = (newDate) => {
    this.setState({
      dateTo: newDate,
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  ShowHideFilters = (e) => {
    this.setState({
      show: !this.state.show,
    });
  };

  updateorderStatus = async (id, status) => {
    const data = {
      order_id: id,
      last_status: status,
    };
    const response = await instance
      .post(requests.fetchUpdateOrdersForDriver, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.getDriverOrder();
    }
  };

  getDriverOrder = async () => {
    let body = {
      startDate: this.state.dateFrom,
      endDate: this.state.dateTo,
      // owner_id: this.state.restaurant,
      items_in_page: 10,
      page_number: this.state.currentPage,
    };

    const response = await instance
      .post(requests.fetchDriverOrder, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      console.log("response => ",response.data)
      this.setState(
        {
          datas: response.data.data.length > 0 ? response.data.data[0].docs : [] ,
          currentPage: response.data.data.length > 0 ? response.data.data[0].pageInfo.page_number : [],
          total: response.data.data.length > 0 ? response.data.data[0].pageInfo.count : [],
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  };

  componentDidMount = () => {
    this.getDriverOrder();
    if (get_fcm_registration_token === null) {
      return null;
    } else {
      messaging.onMessage(async (payload) => {
        let body = {
          startDate: this.state.dateFrom,
          endDate: this.state.dateTo,
          // owner_id: this.state.restaurant,
          items_in_page: 10,
          page_number: this.state.currentPage,
        };
        const response = await instance
          .post(requests.fetchDriverOrder, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage);
          });
        if (response && response.data) {
          this.setState(
            {
              datas: response.data.data[0].docs,
              currentPage: response.data.data[0].pageInfo.page_number,
              total: response.data.data[0].pageInfo.count,
            },
            () => {
              this.setState({ LoaderShow: false });
            }
          );
        }else{
          this.setState({ LoaderShow: false });
        }
        
      });
    }
  };

  render() {
    const { total, currentPage } = this.state;
    pageLinks = [];
    numberOfPages = 0;
    if (this.state.total % 10 === 0) {
      numberOfPages = Math.floor(total / 10);
    } else {
      numberOfPages = Math.floor(total / 10) + 1;
    }
    for (let i = 1; i <= numberOfPages; i++) {
      pageLinks.push(i);
    }
    return (
      <>
        {/* <Header /> */}
        {/* Page content */}

        {/* header */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <br />
              <br />
            </div>
          </Container>
        </div>

        <Container className="mt--7" fluid>
          <Loader open={this.state.LoaderShow} />
          <Row>
            <Col className="col">
              <Card className=" shadow">
                <CardHeader className="bg-transparent">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h1 className=" mb-0">Orders</h1>
                    </div>
                    <div>
                      <div className="col-4 text-right">
                        <button
                          id="show-hide-filters"
                          className="btn btn-icon btn-1 btn-sm btn-outline-secondary"
                          type="button"
                          onClick={this.ShowHideFilters}
                        >
                          {this.state.show ? (
                            <span className="btn-inner--icon">
                              <i
                                id="button-filters"
                                className="ni ni-bold-up"
                              ></i>
                            </span>
                          ) : (
                            <span className="btn-inner--icon">
                              <i
                                id="button-filters"
                                className="ni ni-bold-down"
                              ></i>
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {this.state.show && (
                  <CardBody id="filter">
                    <Form>
                      <Row>
                        <Col md={6} lg={6} sm={6} xs={12}>
                          <FormGroup>
                            <Row>
                              <Col md={12} lg={12} xs={12}>
                                <Label for="DateFrom">
                                  {" "}
                                  {i18next.t("Filter by Date From")}{" "}
                                </Label>
                              </Col>
                              <Col md={12} lg={12} xs={12}>
                                <InputGroup className="input-group-alternative">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <ReactDatetime
                                    onChange={this.handleDateFromChange}
                                    value={this.state.dateFrom}
                                    timeFormat={false}
                                    inputProps={{
                                      placeholder: i18next.t("Date From"),
                                    }}
                                  />
                                </InputGroup>
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col md={6} lg={6} sm={6} xs={12}>
                          <FormGroup>
                            <Row>
                              <Col md={12} lg={12} xs={12}>
                                <Label for="DateTo">{i18next.t("to")}</Label>
                              </Col>
                              <Col md={12} lg={12} xs={12}>
                                <InputGroup className="input-group-alternative">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <ReactDatetime
                                    onChange={this.handleDateToChange}
                                    value={this.state.dateTo}
                                    inputProps={{
                                      placeholder: i18next.t("Date To"),
                                    }}
                                    timeFormat={false}
                                  />
                                </InputGroup>
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="d-flex justify-content-between">
                        <Col md={3} lg={3} sm={6}></Col>
                        <Col md={3} lg={3} sm={6}></Col>
                        <Col md={3} lg={3} sm={6}></Col>
                        <Col md={2} lg={2} sm={6}>
                          <div className="text-right">
                            <Button
                              className="mt-4 btn-md btn-block"
                              color="primary"
                              type="button"
                              size="lg"
                            >
                              {i18next.t("Filter")}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                )}
              </Card>
            </Col>
          </Row>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">{i18next.t("Order Tables")}</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">RESTUARANT</th>
                      <th scope="col">CREATED</th>
                      <th scope="col">TIMESLOT</th>
                      <th scope="col">METHOD</th>
                      <th scope="col">LAST STATUS</th>
                      <th scope="col">CLIENT</th>
                      <th scope="col">PRICE</th>
                      <th scope="col">DELIVERY</th>
                      <th scope="col">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.length > 0 ?
                      this.state.datas.map((item, index) => (
                        <tr>
                          <th scope="row">
                            <Badge
                              color="success"
                              // href=""
                              // onClick={() => {
                              //   this.handleMovetoODetail(item._id, index);
                              // }}
                            >
                              {item.o_id}
                            </Badge>
                          </th>
                          <td>
                            <div className="avatar-group">
                              <a
                                className="avatar avatar-sm"
                                href="#pablo"
                                id="tooltip742438047"
                                onClick={(e) => e.preventDefault()}
                              >
                                <img
                                  alt="..."
                                  className="avatar avatar-sm"
                                  //src={item.owner_name.restaurant_image}
                                  src={
                                    item.owner_name.hasOwnProperty(
                                      "restaurant_image"
                                    )
                                      ? item.owner_name.restaurant_image.image_url
                                      : process.env.REACT_APP_DEFAULT_IMAGE
                                  }
                                />
                              </a>
                              {item.owner_name.restaurant_Name}
                            </div>
                          </td>
                          <td>
                            <Moment format="Do MMM YYYY, hh:mm">
                              {item.createdAt}
                            </Moment>
                          </td>
                          <td>{item.time_slot}</td>
                          <td>
                            {item.is_delivery ? (
                              <td class="table-web">
                                <span class="badge badge-primary badge-pill">
                                  {i18next.t("Delivery")}
                                </span>
                              </td>
                            ) : (
                              <td class="table-web">
                                <span class="badge badge-success badge-pill">
                                  {i18next.t("Pickup")}
                                </span>
                              </td>
                            )}
                          </td>
                          <td>{item.last_status}</td>
                          <td>{item.client_name.name}</td>
                          <td>{item.total}</td>
                          <td>{item.delivery_charge}</td>
                          <td>
                            {item.last_status === "Assigned to Driver" ? (
                              <Button
                                color="primary"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  this.updateorderStatus(item._id, "Delivered");
                                }}
                              >
                                {i18next.t("Delivered")}
                              </Button>
                            ) : (
                              <>{i18next.t("No actions for you right now!")}</>
                            )}
                          </td>
                        </tr>
                      ))
                    :
                      <td>No data Found</td>
                    }
                         
                    </tbody>
                </Table>

                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem
                        disabled={this.state.currentPage === 1 ? true : false}
                      >
                        <PaginationLink
                          onClick={this.handlePagePrev}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">{i18next.t("Previous")}</span>
                        </PaginationLink>
                      </PaginationItem>

                      {pageLinks.map((num) => {
                        return (
                          <PaginationItem
                            active={this.state.currentPage === num}
                          >
                            <PaginationLink
                              onClick={() => {
                                this.handlePageNum(num);
                              }}
                            >
                              {num}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem
                        disabled={
                          numberOfPages - this.state.currentPage === 0
                            ? true
                            : false
                        }
                      >
                        <PaginationLink onClick={this.handlePageNext}>
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">{i18next.t("Next")}</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
          <NotificationContainer />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
