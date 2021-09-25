import React from "react";
// react plugin used to create google maps

import Loader from "../../../common/Loader";
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
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import ReactDatetime from "react-datetime";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

// for api integration
import instance from "../../../../axios";
import requests from "../../../../requests";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import Moment from "react-moment";

let token = null;
let GetRestaurantDeatilAdmin = {};
let start;
let pageLinks = [];
let numberOfPages = 0;
let StoreRestaurantId = {};

const mapStateToProps = (state) => {
  token = state.token;
  GetRestaurantDeatilAdmin = state.GetRestaurantDeatilAdmin;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class Restaurants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Loader: true,
      datas: undefined,
      currentPage: 1,
      total: undefined,
    };
  }

  getRestaurantDeatil = async () => {
    console.log("Default Image = ", process.env.REACT_APP_DEFAULT_IMAGE);
    const body = {
      pageno: this.state.currentPage,
      perpage: 10,
    };
    const response = await instance
      .post(requests.fetchRestaurantDetailsAtAdmin, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      console.log("Response ==> ", response);
      this.props.GET_RESTAURANT_DEATIL_ADMIN(response.data.data.Restaurants);
      this.setState(
        {
          datas: response.data.data.Restaurants,
          total: response.data.data.total,
          currentPage: response.data.data.page,
        },
        () => {
          this.setState({ Loader: false });
        }
      );
    }
  };

  handleActiveDeactivate = async (id, active) => {
    const body = {
      userid: id,
      isActive: !active,
    };
    const response = await instance
      .patch(requests.fetchActiveDeactivate, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });

    if (response && response.data) {
      this.getRestaurantDeatil();
    }
  };

  componentDidMount = () => {
    this.getRestaurantDeatil();
    pageLinks = [];
    numberOfPages = 0;
  };

  restaurantsRegistration = () => {
    // const { history } = this.props;
    // if (history) history.push("/Create");
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getRestaurantDeatil();
    });
  };

  handleMoveToEditPage = (id, index) => {
    const r_id = { id: id };
    this.props.STORE_RESTAURANT_ID(r_id);
    setTimeout(() => {
      const { history } = this.props;
      if (history) {
        history.push(`/update/restaurants/${index}`);
      }
    }, 3000);
  };

  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.getRestaurantDeatil();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getRestaurantDeatil();
    });
  };

  render() {
    const { datas, total, currentPage } = this.state;
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
          <Row>
            {/* <Loader open={this.state.Loader} /> */}
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("Companies")}</h1>
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={this.restaurantsRegistration}
                          >
                            {i18next.t("Add companies")}
                          </Button>
                        </Col>
                        {/* <Col>
                          <Button color="primary" size="sm" type="button">
                            Import from CSV
                          </Button>
                        </Col> */}
                      </Row>
                    </div>
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">LOGO</th>
                      <th scope="col">Name</th>
                      <th scope="col">OWNER</th>
                      <th scope="col">OWNER EMAIL</th>
                      <th scope="col">CREATION DATE</th>
                      <th scope="col">ACTIVE</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.Loader === false &&
                      datas.map((item, index) => {
                        let id = item._id;
                        let isActive = item.isActive;

                        return (
                          <tr>
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
                                    //src={require("assets/img/theme/team-1-800x800.jpg")}
                                    src={
                                      item.hasOwnProperty("restaurant_image")
                                        ? item.restaurant_image.image_url
                                        : process.env.REACT_APP_DEFAULT_IMAGE
                                    }
                                  />
                                </a>
                              </div>
                            </td>
                            <th scope="row">{item.restaurant_Name}</th>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>
                              <Moment format="Do MMM YYYY, hh:mm">
                                {item.createdAt}
                              </Moment>
                            </td>
                            <td>
                              {item.isActive ? (
                                <Button
                                  disabled
                                  color="success"
                                  size="sm"
                                  type="button"
                                >
                                  {i18next.t("Active")}
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  color="danger"
                                  size="sm"
                                  type="button"
                                >
                                  {i18next.t("Inactive")}
                                </Button>
                              )}
                            </td>
                            <td>
                              <UncontrolledDropdown>
                                <Button
                                  style={{ padding: 0, border: "none" }}
                                  color="secondary"
                                  outline
                                  type="button"
                                  className="text-muted"
                                >
                                  <DropdownToggle
                                    style={{ border: "none" }}
                                    outline
                                  >
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                  </DropdownToggle>
                                </Button>
                                <DropdownMenu right>
                                  <DropdownItem
                                    onClick={() => {
                                      this.handleMoveToEditPage(id, index);
                                    }}
                                  >
                                    {i18next.t("Edit")}
                                  </DropdownItem>
                                  {item.isActive ? (
                                    <DropdownItem
                                      onClick={() => {
                                        this.handleActiveDeactivate(
                                          id,
                                          isActive
                                        );
                                      }}
                                    >
                                      {i18next.t("Deactivate")}
                                    </DropdownItem>
                                  ) : (
                                    <DropdownItem
                                      onClick={() => {
                                        this.handleActiveDeactivate(
                                          id,
                                          isActive
                                        );
                                      }}
                                    >
                                      {i18next.t("Activate")}
                                    </DropdownItem>
                                  )}
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        );
                      })}
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
                          <span className="sr-only">
                            {i18next.t("Previous")}
                          </span>
                        </PaginationLink>
                      </PaginationItem>

                      {pageLinks.map((num) => {
                        return (
                          <PaginationItem active={currentPage === num}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants);
