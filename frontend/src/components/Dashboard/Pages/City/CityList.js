import React from "react";
// react plugin used to create google maps
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
} from "reactstrap";

import ReactDatetime from "react-datetime";
import Loader from "../../../common/Loader";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../../axios";
import requests from "../../../../requests";

// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let token = null;
let pageLinks = [];
let numberOfPages = 0;

const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class CityList extends React.Component {
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
      this.getCityList();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getCityList();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getCityList();
    });
  };


  getCityList = async() => {
    let bodyAPI = {
      pageno: this.state.currentPage,
      perpage: 10,
    };
    const response = await instance
      .post(requests.fetchCityForAdmin, bodyAPI, {
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
          datas: response.data.data.cities,
          currentPage: response.data.data.page,
          total: response.data.data.total,
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  }

  componentDidMount = async () => {
    this.getCityList();
  };

  redirectNewCity = () => {
    const { history } = this.props;
    if (history) history.push("/cities/create");
  };
  redirectEditCity = (index, item) => {
    this.props.GET_EDIT_CITY_DETAIL(item);
    const { history } = this.props;
    if (history) history.push(`/city/edit/${index}`);
  };
  onCallDelete = async (id) => {
    const response = await instance
      .delete(requests.fetchDeleteCity + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      NotificationManager.success("Successfully Deleted");

      setTimeout(() => {
        const { history } = this.props;
        if (history) history.push(`/city`);
      }, 2000);
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
          <Loader open={this.state.LoaderShow} />
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("Cities")}</h1>
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={this.redirectNewCity}
                          >
                            {i18next.t("Add new City")}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">SHORT NAME</th>
                      <th scope="col">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.datas.map((item, index) => (
                      <tr key={index + 1}>
                        <td>{item.city_name}</td>
                        <td>{item.short_code}</td>
                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={() =>
                              this.redirectEditCity(index + 1, item)
                            }
                          >
                            {i18next.t("Edit")}
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            type="button"
                            onClick={() => this.onCallDelete(item._id)}
                          >
                            {i18next.t("Delete")}
                          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(CityList);
