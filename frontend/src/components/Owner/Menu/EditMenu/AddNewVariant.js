import React, { Component } from "react";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import routes from "../../../../ownerRoutes";
import Navbar from "../../../../components/Navbars/AdminNavbar";

import { Link } from "react-router-dom";

import i18next from "i18next"

import Loader from "../../../common/Loader";

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
  FormGroup,
  Input,
  Label,
} from "reactstrap";

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
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class UpdateNewVarientOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Variant_name: "",
      Variant_price: null,
      Loader: true,
      variant_op: null,
      variant_op_id: "",
      // variant: {},
    };
  }

  AddVariantApi = async () => {
    const data = {
      dish_id: StoreVariantForOption.id,
      price: this.state.Variant_price,
      variant_op_id: this.state.variant_op_id,
      variant_name: this.state.Variant_name,
    };
    const response = await instance
      .post(requests.fetchAddNewVariant, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.data;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      const match = response.data.data;
      this.props.GET_DISH_ITEM_IN_UPDATE(match);
      const { history } = this.props;
      if (history) {
        history.push(`/menu/item/edit/variant/${StoreDishidForEdit.index}`);
      }
    }
  };

  // handleAddNewVariantOP = async () => {
  //   const { id, option_name, option_value } = this.state;
  //   const option_values = option_value.split(",");
  //   console.log(option_values);
  //   const detail = {
  //     variant_op_id: id,
  //     option_name: option_name,
  //     option_values: option_values,
  //   };
  //   const response = await instance
  //     .patch(requests.fetchupdateNewVariantOption, detail, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .catch((error) => {
  //       let errorMessage = error.response.data.error.message;
  //       NotificationManager.error(errorMessage);
  //       console.log(errorMessage);
  //     });
  //   if (response && response.data) {
  //     console.log(response.data.data);
  //     const appendData = response.data.data;
  //     let GetDishItemInUpdate =appendData
  //     this.props.GET_DISH_ITEM_IN_UPDATE(GetDishItemInUpdate);
  //     console.log("=======",GetDishItemInUpdate);
  //     const { history } = this.props;
  //     if (history) {
  //       history.push(`/menu/item/edit/option/${StoreDishidForEdit.index}`);
  //     }
  //   }
  // };

  handleChangeAll = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  getVariantOpForSelection = async () => {

    const data = {
      dish_id: StoreVariantForOption.id,
    };

    const response = await instance
      .post(requests.fetchDishVariantOption, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response;
        console.log(errorMessage);
      });

    if (response && response.data) {


      const data =
        response.data.data.hasOwnProperty("variant_options") === true
          ? response.data.data.variant_options
          : "";

      this.setState(
        {
          variant_op: data,
        },
        () => {
          this.setState({ Loader: false });
        }
      );
    }
  };

  componentDidMount = () => {
    this.getVariantOpForSelection();
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
                    <BreadcrumbItem
                      style={{ textDecoration: "none", color: "#000" }}
                      tag="a"
                    >
                      <Link
                        to={`/menu/item/edit/variant/${StoreDishidForEdit.index}`}
                        style={{ textDecoration: "none", color: "#000" }}
                      >
                        Variant
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active tag="span">
                      {/* {StoreVariantOptionIdForOption.name} */}
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
                <Col sm={5}></Col>
              </Row>
            </Container>
          </div>

          <Container className="mt--7" fluid>
            <Loader open={this.state.Loader} />
            <Card className="bg-profile shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="6">
                    <h3 className="mb-0">{`Edit Option `}</h3>
                  </Col>
                  <Col className="text-right" xs="6">
                    <Link
                      to={`/menu/item/edit/variant/${StoreDishidForEdit.index}`}
                    >
                      <Button color="primary" size="sm">
                        {i18next.t("Back")}
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label className="mb-2 font-weight-bold" for="variant_option">
                    {i18next.t("Select Variant Option For Variant")}
                  </Label>
                  <Input
                    type="select"
                    name="variant_op_id"
                    id="variant_option"
                    onChange={this.handleChangeAll}
                  >
                    <option value="" selected>
                      -- Select optionVariant Option--
                    </option>
                    {this.state.Loader === false
                      ? this.state.variant_op === null
                      ? ""
                      : this.state.variant_op.map((v_op, i) => {
                          return (
                            <option value={v_op._id}>{v_op.option_name}</option>
                          );
                        })
                      : ""}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label className="mb-2 font-weight-bold" for="item_name">
                    {i18next.t("Variant Name")}
                  </Label>
                  <Input
                    className="px-2 py-4"
                    type="text"
                    placeholder={i18next.t("Variant Name")}
                    name="Variant_name"
                    // value={Variant_name}
                    onChange={this.handleChangeAll}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="mb-2 font-weight-bold" for="item_name">
                   {i18next.t("Variant Price")}
                  </Label>
                  <Input
                    className="px-2 py-4"
                    type="number"
                    placeholder={i18next.t("Variant Price")}
                    name="Variant_price"
                    // value={Variant_price}
                    onChange={this.handleChangeAll}
                  />
                </FormGroup>
                <div className="text-center mt-4">
                  <Button
                    color="success"
                    type="button"
                    onClick={this.AddVariantApi}
                  >
                    {i18next.t("Add Variants")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateNewVarientOption);
