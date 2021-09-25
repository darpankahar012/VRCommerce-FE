import React from "react";
import i18next from "i18next";
// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { messaging } from "../../firebase";

import {
  Card,
  Badge,
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
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";

import ReactDatetime from "react-datetime";

import Moment from "moment";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../axios";
import requests from "../../requests";
import Loader from "../../components/common/Loader";

let token = null;
let pageLinks = [];
let numberOfPages = 0;

const mapStateToProps = (state) => {
  token = state.token;
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
      datas: [],
      LoaderShow: true,
      currentPage: 1,
      total: 10,
    };
  }
  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.getOrderList();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getOrderList();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getOrderList();
    });
  };

  getOrderList = async () => {
    this.setState({ LoaderShow: true });
    let filterData = {
      startDate: this.state.dateFrom,
      endDate: this.state.dateTo,
      items_in_page: 10,
      page_number: this.state.currentPage,
    };
    const response = await instance
      .post(requests.fetchMyordersForClient, filterData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      console.log("Response of Order List : ",response)
      this.setState(
        {
          datas: response.data.data[0] ? response.data.data[0].docs : [],
          currentPage: response.data.data[0]
            ? response.data.data[0].pageInfo.page_number
            : 0,
          total: response.data.data[0]
            ? response.data.data[0].pageInfo.count
            : 0,
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  };

  componentDidMount = async () => {
    this.getOrderList();
    messaging.onMessage(async (payload) => {
      this.setState({ LoaderShow: true });
      let filterData = {
        startDate: "",
        endDate: "",
        items_in_page: 10,
        page_number: this.state.currentPage,
      };
      const response = await instance
        .post(requests.fetchMyordersForClient, filterData, {
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
            datas: response.data.data[0] ? response.data.data[0].docs : [],
            currentPage: response.data.data[0]
              ? response.data.data[0].pageInfo.page_number
              : 0,
            total: response.data.data[0]
              ? response.data.data[0].pageInfo.count
              : 0,
          },
          () => {
            this.setState({ LoaderShow: false });
          }
        );
      }
    });
  };
  applyFilter = async () => {
    this.getOrderList();
    // let filterData = {
    //   startDate: this.state.dateFrom,
    //   endDate: this.state.dateTo,
    //   items_in_page: 10,
    //   page_number:this.state.currentPage
    // };
    // console.log("Body => ",filterData);
    // const response = await instance
    //   .post(requests.fetchMyordersForClient, filterData, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .catch((error) => {
    //     let errorMessage = error.response.data.error.message;
    //     NotificationManager.error(errorMessage);
    //   });
    // if (response && response.data) {
    //   this.setState({
    //     datas: response.data.data,
    //   });
    // }
  };
  handleDateFromChange = (newDate) => {
    this.setState({
        dateFrom: newDate,
      });
  };
  handleDateToChange = (newDate) => {
    this.setState(
      {
        dateTo: newDate,
      }
    );
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

  handleMovetoODetail = (O_id, index) => {
    this.props.ALL_ID({ O_id });
    const { history } = this.props;
    if (history) {
      history.push(`/client/orders/detail/${index}`);
    }
  };

  render() {
    let date = null;
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
                      <h1 className=" mb-0">{i18next.t("Orders")}</h1>
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
                        <Col md={4} lg={4} sm={6} xs={12}>
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
                                      placeholder: "Date From",
                                    }}
                                  />
                                </InputGroup>
                              </Col>
                            </Row>
                          </FormGroup>
                        </Col>
                        <Col md={4} lg={4} sm={6} xs={12}>
                          <FormGroup>
                            <Row>
                              <Col md={12} lg={12} xs={12}>
                                <Label for="DateTo">{i18next.t("To")}</Label>
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
                                      placeholder: "Date To",
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
                              onClick={this.applyFilter}
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
                      <th scope="col">PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.length > 0 ? (
                      this.state.datas.map((item, index) => (
                        <tr>
                          <th scope="row">
                            <Badge
                          
                              color="success"
                              href=""
                              onClick={() => {
                                this.handleMovetoODetail(item._id, index);
                              }}
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
                                  src={item.owners.hasOwnProperty("restaurant_image") ? item.owners.restaurant_image.image_url : process.env.REACT_APP_DEFAULT_IMAGE }
                                />
                              </a>
                              {item.owners.restaurant_Name}
                            </div>
                          </td>
                          <td>
                            {Moment(item.createdAt).format("DD-MMM-YYYY hh:mm")}
                          </td>
                          <td>{item.time_slot}</td>
                          <td>
                            {item.is_delivery && (
                              <span className="badge badge-primary badge-pill">
                                {i18next.t("Delivery")}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="badge badge-success badge-pill">
                              {item.last_status}
                            </span>
                          </td>
                          <td>{item.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>{i18next.t("Data Not Found ..!")}</td>
                      </tr>
                    )}
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
