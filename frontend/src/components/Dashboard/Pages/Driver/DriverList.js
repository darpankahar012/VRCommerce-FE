
import React from "react";
// react plugin used to create google maps
import i18next from "i18next"
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
class DriverList extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      datas:[],
      LoaderShow: true,
      currentPage: 1,
      total: 10,
    }
  }

  driversRegistration = () => {
      const {history} = this.props;
      if (history) history.push('/drivers/create')
  };

  handlePageNext = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 }, () => {
      this.getDriverList();
    });
  };

  handlePagePrev = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 }, () => {
      this.getDriverList();
    });
  };

  handlePageNum = (num) => {
    this.setState({ currentPage: num }, () => {
      this.getDriverList();
    });
  };

  getDriverList = async() => {
    let bodyAPI = {
      pageno: this.state.currentPage,
      perpage: 10,
    };
    const response = await instance
      .post(requests.fetchDriverForAdmin, bodyAPI, {
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
        datas: response.data.data.Drivers,
        currentPage: response.data.data.page,
        total: response.data.data.total,
      },
      () => {
        this.setState({ LoaderShow: false });
      });
    }
  }
  componentDidMount = async () => {
    this.getDriverList();
  }

  handleChangeforCheckbox = async (e,index,id) => {
    const name = e.target.name;
    const value = e.target.checked;

    let bodyAPI = {
      "userid":id,
      "isActive":value
    }
    const response = await instance.patch(requests.fetchActiveDeactivate,bodyAPI,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    }).catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage)
    });
    if(response && response.data){
      let dataNew = this.state.datas
  
    dataNew[index].isActive=value
      this.setState ({
        datas:dataNew
      })
    }
  }
  onCallDelete = async (id) => {
    let bodyAPI = {
      "pageno":1,
      "perpage":10
    }
    const response = await instance
      .post(requests.fetchDeleteDriverFromAdmin + `/${id}`,bodyAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.getDriverList();
    }
  };
  redirectEditDriver = (index, item) => {
    this.props.GET_EDIT_DRIVER_DETAIL(item);
    const { history } = this.props;
    if (history) history.push(`/driver/edit/${index}`);
  };
  
  // onCallIsActive = async (id,status,index) => {
  //   let bodyAPI = {
  //     "userid":id,
  //     "isActive":status
  //   }
  //   console.log("Body Api ", bodyAPI)
  //   console.log("Id ,Index ==> ",id,index)
  //   const response = await instance
  //     .patch(requests.fetchActiveDeactivate, bodyAPI, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .catch((error) => {
  //       let errorMessage = error.response.data.error.message;
  //       NotificationManager.error(errorMessage);
  //     });
  //   if (response && response.data) {
  //     let data=this.state.datas
  //     data[index] =  response.data.data.acivation
  //     this.setState({
  //       datas: data,
  //     },() => {
  //       NotificationManager.success('Successfully Updated...!');
  //     })
  //   }
  // }
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
                      <h1 className="mb-0">{i18next.t("Drivers")}</h1>  
                    </div>
                    <div className="md-5">
                        <Row>
                            <Col>
                                <Button color="primary" size="sm" type="button"
                                  onClick={this.driversRegistration}>
                                    {i18next.t("Add Drivers")}
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
                      <th scope="col">EMAIL</th>
                      <th scope="col">CREATION DATE</th>
                      <th scope="col">Active/Inactive</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                   {
                     this.state.datas.map((item,index) => 
                     <tr>
                      <td>
                        {item.name}                    
                      </td>
                      <td>
                        {item.email}
                      </td>    
                      <td>
                        <Moment format="Do MMM YYYY, hh:mm">
                          {item.createdAt}
                        </Moment>
                      </td>
                      {/* <td>
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
                          {
                            item.isActive ?
                              <DropdownItem onClick={ () => this.onCallIsActive (item._id,"false",index) } >Deactivate</DropdownItem>
                            :<DropdownItem onClick={ () => this.onCallIsActive (item._id,"true",index) }>Activate</DropdownItem>
                          }
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td> */}
                      <td>
                        <label className="custom-toggle">
                            {item.isActive === true ? (
                              <input
                                defaultChecked
                                type="checkbox"
                                name="isActive"
                                onChange={(e) => {this.handleChangeforCheckbox(e,index,item._id)}}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                name="isActive"
                                onChange={(e) => {this.handleChangeforCheckbox(e,index,item._id)}}
                              />
                            )}
                            <span className="custom-toggle-slider rounded-circle" />
                          </label>
                      </td>
                      <td>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={() => this.redirectEditDriver(index + 1, item)}
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

export default connect(mapStateToProps, mapDispatchToProps)(DriverList);
