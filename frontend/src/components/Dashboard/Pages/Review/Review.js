
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

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../../axios";
import requests from "../../../../requests";

// Loader
import Loader from "../../../common/Loader";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import ReactDatetime from "react-datetime";

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

class Review extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      datas:[],
      LoaderShow: true,
      currentPage: 1,
      total: 10,
    }
  }

  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.getReviewList();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getReviewList();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getReviewList();
    });
  };

  getReviewList = async() => {
    let bodyAPI = {
      "pageno": this.state.currentPage,
      "perpage": 10,
    };
    const response = await instance
      .post(requests.fetchReviewForAdmin, bodyAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState({
        datas: response.data.data.reviews,
        currentPage: response.data.data.page,
        total: response.data.data.total,
      },
      () => {
        this.setState({ LoaderShow: false });
      });
    }
  }
  componentDidMount = async () => {
    this.getReviewList();
  }
  OnCallDelete = async (id) => {
    const response = await instance
      .delete(requests.fetchReviewDeleteFromAdmin +`/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState({
        datas: response.data.data.reviews,
        currentPage: response.data.data.page,
        total: response.data.data.total,
      },
      () => {
        this.setState({ LoaderShow: false });
      });
    }
  }

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
              <br/><br/>
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
                      <h1 className="mb-0">{i18next.t("Orders Reviews")}</h1>  
                    </div>
                    <div className="md-5">
                        <Row>
                            <Col>
                                
                            </Col>
                        </Row>
                    </div>
                    
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">RATING</th>
                      <th scope="col">COMMENT</th>
                      <th scope="col">ORDER</th>
                      <th scope="col">USER</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                   {
                     this.state.datas.map((item,index) => 
                     <tr>
                      <td>
                        {item.restaurant_ratings}                    
                      </td>
                      <td>
                        {item.comments}
                      </td>    
                      <td>
                          {item.order}
                      </td>
                      <td>
                          {item.clientuser.name}
                      </td>
                      <td>
                      {  
                        <Button color="danger" size="sm" type="button"
                          onClick={() => this.OnCallDelete(item._id)}>
                            {i18next.t("Delete")}
                          </Button>
                      }
                      </td>
                      
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

export default connect(mapStateToProps, mapDispatchToProps)(Review);
