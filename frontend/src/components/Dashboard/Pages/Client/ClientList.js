import React from "react";
// react plugin used to create google maps

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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../../axios";
import requests from "../../../../requests";

// Loader
import Loader from "../../../common/Loader";
import i18next from "i18next";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import ReactDatetime from "react-datetime";

// React Moment
import Moment from "react-moment";

let token = null;
let pageLinks = [];
let numberOfPages = 0;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class ClientList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: [],
      LoaderShow: true,
      currentPage: 1,
      total: 10,
    };
  }

  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.getClientList();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getClientList();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getClientList();
    });
  };

  getClientList = async () => {
    let bodyAPI = {
      pageno: this.state.currentPage,
      perpage: 10,
    };
    const response = await instance
      .post(requests.fetchClientForAdmin, bodyAPI, {
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
          datas: response.data.data.Clients,
          currentPage: response.data.data.page,
          total: response.data.data.total,
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  };
  componentDidMount = async () => {
    this.getClientList();
  };

  onCallIsActive = async (id, status, index) => {
    let bodyAPI = {
      userid: id,
      isActive: status,
    };
    const response = await instance
      .patch(requests.fetchActiveDeactivate, bodyAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      let data = this.state.datas;
      data[index] = response.data.data.acivation;
      this.setState(
        {
          datas: data,
        },
        () => {
          NotificationManager.success("Successfully Updated...!");
        }
      );
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
          {/* <Loader open={this.state.LoaderShow} /> */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("Clients")}</h1>
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col></Col>
                      </Row>
                    </div>
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">EMAIL</th>
                      <th scope="col">CREATION DATE</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.map((item, index) => (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          <Moment format="Do MMM YYYY, hh:mm">
                            {item.createdAt}
                          </Moment>
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
                              {item.isActive ? (
                                <DropdownItem
                                  onClick={() =>
                                    this.onCallIsActive(
                                      item._id,
                                      "false",
                                      index
                                    )
                                  }
                                >
                                  {i18next.t("Deactivate")}
                                </DropdownItem>
                              ) : (
                                <DropdownItem
                                  onClick={() =>
                                    this.onCallIsActive(item._id, "true", index)
                                  }
                                >
                                  {i18next.t("Activate")}
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientList);
