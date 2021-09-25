import React, { Component } from "react";
import Sidebar from "../../../Sidebar/Sidebar";
import routes from "../../../../ownerRoutes";
import Navbar from "../../../Navbars/AdminNavbar";
import classnames from "classnames";

import { Link } from "react-router-dom";

// font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

// reactstrap components
import {
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  Table,
  Nav,
  NavItem,
} from "reactstrap";


import i18next from "i18next"

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

let token = null;
let StoreDishidForEdit = {};
let StoreVariantForOption = {};
let GetDishItemInUpdate = {};
let StoreVariantOptionIdForOption = {};

const mapStateToProps = (state) => {
  token = state.token;
  StoreDishidForEdit = state.StoreDishidForEdit;
  StoreVariantForOption = state.StoreVariantForOption;
  GetDishItemInUpdate = state.GetDishItemInUpdate;
  StoreVariantOptionIdForOption = state.StoreVariantOptionIdForOption;
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class EditVarientOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // variant: {},
      tabs: 1,
      variant_op: null,
      op_name_v:
        GetDishItemInUpdate.hasOwnProperty("variant_op") === true
          ? GetDishItemInUpdate.variant_op.variant_options[0].option_name
          : "",
    };
  }

  handleStoreVariantOptionIdForOption = async (id, name, price, variant_op_id,variant_op_name) => {
    let data = {
      variant_id: id,
      name: name,
      price: price,
      variant_op_id: variant_op_id,
      variant_op_name: variant_op_name
      
    };

    this.props.STORE_VARIANT_OP_ID_FOR_OPTION(data);
    const {history} = this.props;
    if(history){
      history.push(`/menu/item/edit/variant/edit/${StoreDishidForEdit.index}`);
    }
  };

  handleDeleteVariant = async (id) => {

    const response = await instance
      .delete(`${requests.fetchDeleteVariant}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response;
        console.log(errorMessage);
      });
    if (response) {

      const match = response.data.data;

      this.props.GET_DISH_ITEM_IN_UPDATE(match);
    }
  };

  toggleNavs = (e, state, index, op_name) => {
    e.preventDefault();
    this.setState({
      [state]: index,
      op_name_v: op_name,
    });
  };

  

  componentDidMount = () => {
    // this.getVariantOpForNav();
  };

  render() {
    return (
      <>
        <Sidebar
          style={{ zindex: 100 }}
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "...",
          }}
        />
        <div className="main-content" ref="mainContent">
          <Navbar />
          {/* <Header /> */}
          <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            <Container fluid>
              <div className="header-body">
                {/* Card stats */}
                <br />
                <br />
              </div>
              <Row>
                <Col xs={12} sm={7}>
                  <Breadcrumb sm={7} tag="nav" listTag="div">
                    <BreadcrumbItem
                      style={{ textDecoration: "none", color: "#000" }}
                      tag="a"
                    >
                      <Link
                        to="/index"
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        <FontAwesomeIcon icon={faHome} />
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem
                      style={{ textDecoration: "none", color: "#000" }}
                      tag="a"
                    >
                      <Link
                        to={"/menu"}
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        Menu
                      </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem
                      style={{ textDecoration: "none", color: "#000" }}
                      tag="a"
                    >
                      <Link
                        to={`/menu/item/edit/${StoreDishidForEdit.index}`}
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        {StoreVariantForOption.name}
                      </Link>
                    </BreadcrumbItem>

                    <BreadcrumbItem active tag="span">
                      Variant
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                <Col sm={5}></Col>
              </Row>
            </Container>
          </div>
          <Container className="mt--7" fluid>
            <Card className="bg-profile shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">{`Options for ${StoreVariantForOption.name}`}</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <Link
                      className="mr-3"
                      to={`/menu/item/edit/variant/create/${StoreDishidForEdit.index}`}
                    >
                      <Button color="primary" size="sm">
                        {i18next.t("Add New Option")}
                      </Button>
                    </Link>
                  </Col>
                </Row>
                <Row
                  className="align-items-center mt-3"
                  style={{ marginLeft: "0.2rem" }}
                >
                  <Nav
                    // className="nav-fill flex-column flex-md-row tabbable sticky "
                    className="tabbable sticky "
                    id="tabs-icons-text"
                    pills
                    role="tablist"
                  >
                    {GetDishItemInUpdate.hasOwnProperty("variant_op") === false
                      ? ""
                      : GetDishItemInUpdate.variant_op.variant_options.map(
                          (op, index) => {
                            return (
                              <>
                                <NavItem>
                                  <Button
                                    aria-selected={
                                      this.state.tabs === index + 1
                                    }
                                    className={classnames("", {
                                      active: this.state.tabs === index + 1,
                                    })}
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) =>
                                      this.toggleNavs(
                                        e,
                                        "tabs",
                                        index + 1,
                                        op.option_name
                                      )
                                    }
                                    role="tab"
                                    color="default"
                                    outline
                                  >
                                    {op.option_name}
                                  </Button>
                                </NavItem>
                              </>
                            );
                          }
                        )}
                  </Nav>
                </Row>
              </CardHeader>
              {/* <hr className="my-1" /> */}
              <CardBody className="p-0">
                {GetDishItemInUpdate.variants.length <= 0 ? (
                  <>
                    <Table className="align-items-center" responsive>
                      <thead className="thead-light">
                        <th>VARIANT</th>
                        <th>PRICE</th>
                        <th>ACTIONS</th>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{i18next.t("there is no option")}</th>
                        </tr>
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <>
                    {GetDishItemInUpdate.variants.map((option, i) => {
                      return (
                        <>
                          {option.option_name === this.state.op_name_v && (
                            <>
                              <Table className="align-items-center" responsive>
                                <thead className="thead-light">
                                  <tr>
                                    <th>VARIANT</th>
                                    <th>PRICE</th>
                                    <th>ACTIONS</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {option.variants.map((variant, index) => {
                                    return (
                                      <>
                                        <tr>
                                          <th>{variant.variant_name}</th>
                                          <th>{variant.price}</th>
                                          <th>
                                            <Button
                                              color="primary"
                                              type="button"
                                              onClick={() => {
                                                this.handleStoreVariantOptionIdForOption(
                                                  variant._id,
                                                  variant.variant_name,
                                                  variant.price,
                                                  option._id,
                                                  option.option_name
                                                );
                                              }}
                                            >
                                              {i18next.t("Edit")}
                                            </Button>

                                            <Button
                                              color="danger"
                                              type="button"
                                              onClick={() => {
                                                this.handleDeleteVariant(
                                                  variant._id
                                                );
                                              }}
                                            >
                                              {i18next.t("Delete")}
                                            </Button>
                                          </th>
                                        </tr>
                                      </>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </>
                          )}
                        </>
                      );
                    })}
                  </>
                )}

                {/* {GetDishItemInUpdate.variants.length <= 0 ? (
                    <>
                      <tbody>
                        <p>there is no option</p>
                      </tbody>
                    </>
                  ) : (
                    <>
                      {GetDishItemInUpdate.variants.map((option, i) => {
                        return (
                          <>
                            <TabContent
                              activeTab={this.state.tabs}
                              sm={12}
                              md={12}
                              xl={12}
                              xs={12}
                            >
                              <tbody>
                                <TabPane
                                  tabId={i + 1}
                                  sm={12}
                                  md={12}
                                  xl={12}
                                  xs={12}
                                >
                                  {option.variants.map((variant, index) => {
                                    
                                    return (
                                      <>
                                        <tr>
                                          <th>{variant.variant_name}</th>
                                          <th>{variant.price}</th>
                                          <th>
                                            
                                            <Button
                                              color="primary"
                                              type="button"
                                              // onClick={() => {
                                              //   this.handleStoreVariantOptionIdForOption(
                                              //     variant._id,
                                              //     variant.option_name,
                                              //     variant.option_values.toString()
                                              //   );
                                              // }}
                                            >
                                              Edit
                                            </Button>
                                            

                                            <Button
                                              color="danger"
                                              type="button"
                                              // onClick={() => {
                                              //   this.handleDeleteVariantOption(
                                              //     variant._id
                                              //   );
                                              // }}
                                            >
                                              Delete
                                            </Button>
                                          </th>
                                        </tr>
                                      </>
                                    );
                                  })}
                                </TabPane>
                              </tbody>
                            </TabContent>
                          </>
                        );
                      })}
                    </>
                  )} */}
              </CardBody>
            </Card>
          </Container>
        </div>
        <NotificationContainer />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVarientOption);
