import React from "react";
// react plugin used to create google maps

import { Dropdown } from "semantic-ui-react";
import ExportCsv from "../OwnerDriver/ExportCsv";

import i18next from "i18next";

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
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Badge,
} from "reactstrap";

//Loder
import Loader from "../../common/Loader";
import ActionOrder from "./ActionOrder";

import ReactDatetime from "react-datetime";

// For Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import Moment from "react-moment";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import { Link } from "react-router-dom";

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
      clientData: [],
      ownerData: [],
      driversData: [],
      show: true,
      dateFrom: "",
      dateTo: "",
      restaurant: "",
      client: "",
      driver: "",
      datas: [],
      LoaderShow: true,
      currentPage: 1,
      total: 10,
    };
  }
  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.GetOrderdetail();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.GetOrderdetail();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.GetOrderdetail();
    });
  };
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

  handleSelectChange = (e, data) => {
    this.setState({
      [data.name]: data.value,
    });
  };

  GetOrderdetail = async () => {
    let filterData = {
      startDate: this.state.dateFrom,
      endDate: this.state.dateTo,
      client_id: this.state.client,
      driver_id: this.state.driver,
      owner_id: this.state.restaurant,
      items_in_page: 10,
      page_number: this.state.currentPage,
    };

    const response = await instance
      .post(requests.fetchOrdersForOwner, filterData, {
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
      if (response.data.data.result.length > 0) {
        let ad = [];
        const CData =
          response.data.data.clients != null
            ? response.data.data.clients.map((Cd, i) => {
                const pf =
                  Cd.hasOwnProperty("profile_image") === true
                    ? `${Cd.profile_image.image_url}`
                    : "";
                ad[i] = {
                  value: Cd._id,
                  key: Cd.name,
                  text: Cd.name,
                  image: { avatar: true, src: pf },
                };
              })
            : [{ value: "", label: "", key: "", image: "" }];

        let bd = [];
        const DData =
          response.data.data.drivers != null
            ? response.data.data.drivers.map((Dd, i) => {
                const dpf =
                  Dd.hasOwnProperty("profile_image") === true
                    ? `${Dd.profile_image.image_url}`
                    : "";
                bd[i] = {
                  value: Dd._id,
                  key: Dd.name,
                  text: Dd.name,
                  image: { avatar: true, src: dpf },
                };
              })
            : [{ value: "", label: "", key: "", image: "" }];

        this.setState(
          {
            datas: response.data.data.result[0].docs,
            clientData: ad,
            // response.data.data.clients != null
            //   ? response.data.data.clients
            //   : [{ _id: "", name: "" }],
            driversData: bd,
            // response.data.data.drivers != null
            //   ? response.data.data.drivers
            //   : [{ _id: "", name: "" }],
            currentPage: response.data.data.result[0].pageInfo.page_number,
            total: response.data.data.result[0].pageInfo.count,
          },
          () => {
            this.setState({ LoaderShow: false });
          }
        );
      } else {
        let ad = [];
        const CData =
          response.data.data.clients != null
            ? response.data.data.clients.map((Cd, i) => {
                const pf =
                  Cd.hasOwnProperty("profile_image") === true
                    ? `${Cd.profile_image.image_url}`
                    : "";
                ad[i] = {
                  value: Cd._id,
                  key: Cd.name,
                  text: Cd.name,
                  image: { avatar: true, src: pf },
                };
              })
            : [{ value: "", label: "", key: "", key: "" }];

        let bd = [];
        const DData =
          response.data.data.drivers != null
            ? response.data.data.drivers.map((Dd, i) => {
                const dpf =
                  Dd.hasOwnProperty("profile_image") === true
                    ? `${Dd.profile_image.image_url}`
                    : "";
                bd[i] = {
                  value: Dd._id,
                  key: Dd.name,
                  text: Dd.name,
                  image: { avatar: true, src: dpf },
                };
              })
            : [{ value: "", label: "", key: "", image: "" }];

        this.setState(
          {
            datas: response.data.data.result,
            clientData: ad,
            // response.data.data.clients != null
            //   ? response.data.data.clients
            //   : [{ _id: "", name: "" }],
            driversData: bd,
            // response.data.data.drivers != null
            //   ? response.data.data.drivers
            //   : [{ _id: "", name: "" }],
            currentPage: response.data.data.page,
            total: response.data.data.total,
          },
          () => {
            this.setState({ LoaderShow: false });
          }
        );
      }
    }
  };

  handleActionMethod = async (owner_id, Amethod, driver_id) => {
    const data = {
      order_id: owner_id,
      last_status: Amethod,
      driver_id: driver_id,
    };
    const response = await instance
      .post(requests.fetchUpdateOrdersForOwner, data, {
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
      this.GetOrderdetail();
    }
  };

  handleMovetoODetail = (O_id, index) => {
    this.props.ALL_ID({ O_id });
    const { history } = this.props;
    if (history) {
      history.push(`/orders/detail/${index}`);
    }
  };

  componentDidMount = async () => {
    this.GetOrderdetail();
  };

  render() {
    const { total, currentPage } = this.state;
    const date = new Date();
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
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Label for="DateFrom"> {i18next.t("Filter by Date From")} </Label>
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
                                  placeholder: i18next.t("Date From")
                                }}
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Label for="DateTo">{i18next.t("to")}</Label>
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
                          </FormGroup>
                        </Col>

                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Label for="client">{i18next.t("Filter by Client")}</Label>
                            <Dropdown
                              placeholder={i18next.t("Select Client")}
                              fluid
                              search
                              selection
                              clearable
                              name="client"
                              options={this.state.clientData}
                              onChange={this.handleSelectChange}
                              // name="client"
                            />
                            {/* <Input
                              type="select"
                              name="client"
                              id="client"
                              onChange={this.handleChange}
                              value={this.state.client}
                            >
                              <option value="" selected>
                                --- Select ---
                              </option>
                              {this.state.clientData.map((data, i) => {
                                return (
                                  <option value={data._id}>{data.name}</option>
                                );
                              })}
                            </Input> */}
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <Label for="exampleSelect">{i18next.t("Filter by Driver")}</Label>
                            <Dropdown
                              placeholder={i18next.t("Select Driver")}
                              fluid
                              search
                              selection
                              clearable
                              name="driver"
                              options={this.state.driversData}
                              onChange={this.handleSelectChange}
                              // name="client"
                            />
                            {/* <Input
                              type="select"
                              name="driver"
                              id="exampleSelect"
                              onChange={this.handleChange}
                              value={this.state.driver}
                            >
                              <option value="" selected>
                                --- Select ---
                              </option>
                              {this.state.driversData.map((data, i) => {
                                return (
                                  <option value={data._id}>{data.name}</option>
                                );
                              })}
                            </Input> */}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row className="d-flex justify-content-between">
                        <Col md={3} lg={3} sm={6}></Col>
                        <Col md={3} lg={3} sm={6}></Col>
                        <Col md={3} lg={3} sm={6}></Col>
                        <Col md={3} lg={3} sm={6}>
                          <div className="text-right">
                            <Button
                              className="mt-4 btn-md btn-block"
                              color="primary"
                              type="button"
                              size="lg"
                              onClick={this.GetOrderdetail}
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
                  <div className="d-flex justify-content-between">
                    <div>
                      <h3 className="mb-0">{i18next.t("Order Tables")}</h3>
                    </div>
                    <div
                      className="col-4 text-right"
                      style={{ marginBottom: "auto", marginTop: "auto"}}
                    >
                    <Col
                      className=" text-right"
                      style={{ float: "right" }}
                    >
                      <ExportCsv
                        csvData={this.state.datas}
                        fileName={"orderList"}
                      />
                    </Col>
                    </div>
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">CREATED</th>
                      <th scope="col">TIMESLOT</th>
                      <th scope="col">METHOD</th>
                      <th scope="col">LAST STATUS</th>
                      <th scope="col">CLIENT</th>
                      <th scope="col">ITEMS</th>
                      <th scope="col">DRIVER</th>
                      <th scope="col">PRICE</th>
                      <th scope="col">DELIVERY CHARGES</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.length > 0 ? (
                      this.state.datas.map((item, index) => (
                        <tr>
                          {/* <td>
                            <div className="avatar-group">
                              <a
                                className="avatar avatar-sm"
                                href="#pablo"
                                id="tooltip742438047"
                                onClick={(e) => e.preventDefault()}
                              >
                                <img
                                  alt="..."
                                  className="rounded"
                                  src={require("assets/img/theme/team-1-800x800.jpg")}
                                />
                              </a>
                              {item.restaurant_Name.restaurant_Name}
                            </div>
                          </td> */}
                          <td>
                            <Badge
                              color="success"
                              href=""
                              onClick={() => {
                                this.handleMovetoODetail(item._id, index);
                              }}
                            >
                              {item.o_id}
                            </Badge>
                          </td>
                          <td>
                            <Moment format="Do MMM YYYY, hh:mm">
                              {item.createdAt}
                            </Moment>
                          </td>
                          <td>{item.time_slot}</td>
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
                          <td>{item.last_status}</td>
                          <td>{item.client_name.name}</td>
                          <td>{item.items}</td>
                          {item.driver_id ? (
                            <td>{item.driver_name.name}</td>
                          ) : (
                            <td></td>
                          )}
                          <td>{item.total}</td>
                          <td>{item.delivery_charge}</td>

                          {/*   'Just Created',
                                'Rejected by Owner',
                                'Accepted by Owner',
                                'Rejected by Admin',
                                'Accepted by Admin',
                                'Prepared',
                                'Picked Up',
				                'Delivered' */}

                          <ActionOrder
                            last_status={item.last_status}
                            is_delivery={item.is_delivery}
                            owner_id={item._id}
                            onActionMethod={this.handleActionMethod}
                          />
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td> {i18next.t("Data Not Found ..!")} </td>
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

                {/* <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem className="disabled">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          2 <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={e => e.preventDefault()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
               */}
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
