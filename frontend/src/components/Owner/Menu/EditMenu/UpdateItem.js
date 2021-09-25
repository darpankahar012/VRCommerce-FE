import React, { Component } from "react";

import Sidebar from "../../../../components/Sidebar/Sidebar";
import routes from "../../../../ownerRoutes";
import Navbar from "../../../../components/Navbars/AdminNavbar";
import AddExtras from "./AddExtras";
import AddNewVarientOption from "./AddNewVarientOption";

// React-router
import { Link } from "react-router-dom";


import i18next from "i18next"

// font Awesome

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// for api integration
import instance from "../../../../axios";
import requests from "../../../../requests";

// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Modal,
} from "reactstrap";

let token = null;
let StoreDishidForEdit = {};
let StoreVariantForOption = {};
let GetDishItemInUpdate = {};

const mapStateToProps = (state) => {
  token = state.token;
  StoreDishidForEdit = state.StoreDishidForEdit;
  StoreVariantForOption = state.StoreVariantForOption;
  GetDishItemInUpdate = state.GetDishItemInUpdate;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class UpdateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: StoreDishidForEdit.id,
      item_name: "",
      item_description: "",
      item_price: "",
      vat_percentage: "",
      image: "",
      item_available: false,
      enable_variants: false,
      variants: [],
      extras: [],
      index: StoreDishidForEdit.index,
      showAddextra: false,
      showEditextra: false,
      VariantOptionModal: false,
      EditVariantOption: false,
    };
  }

  showVariantOptionModal = () => {
    this.setState({ VariantOptionModal: true });
  };

  closeVariantOptionModal = () => {
    this.setState({ VariantOptionModal: false });
  };

  handleShowAddExtraModel = () => {
    this.setState({ showAddextra: !this.state.showAddextra }, () => {});
  };

  handleCloseAddExtraModel = () => {
    this.setState({
      showAddextra: !this.state.showAddextra,
    });
  };

  closeAfterAddExtraModel = () => {
    this.setState({ showAddextra: !this.state.showAddextra });
  };

  handleShowEditExtraModel = async (id, price, name) => {

    this.setState(
      {
        extras_name: name,
        extras_price: price,
        extras_id: id,
      },
      () => {
        this.setState({ showEditextra: !this.state.showEditextra });
      }
    );
  };

  onEditExtraSubmit = async () => {
    const data = {
      dish_id: this.state.id,
      extras_id: this.state.extras_id,
      extras_name: this.state.extras_name,
      price: this.state.extras_price,
    };
    const response = await instance
      .patch(requests.fetchUpdateExtras, data, {
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
      let EditExtras = response.data.data;
      this.handleCloseEditExtraModel();
      this.getDishItem();
      this.setState({
        extras_id: "",
        extras_name: "",
        price: "",
      });
    }
  };

  handleCloseEditExtraModel = () => {
    this.setState({
      showEditextra: !this.state.showEditextra,
    });
  };

  closeAfterEditExtraModel = () => {
    this.setState({ showEditextra: !this.state.showEditextra });
  };

  handleStoreVariantForOption = (name) => {
    const detail = {
      id: this.state.id,
      name: name,
    };
    this.props.STORE_VARIANT_FOR_OPTION(detail);
  };

  handleEditVariantOption = (name, variant_option_id) => {
    this.setState(
      {
        EditVariantOptionname: name,
        EditVariantOptionid: variant_option_id,
      },
      () => {
        this.setState({ EditVariantOption: true });
      }
    );
  };

  closeEditVariantOption = () => {
    this.setState(
      {
        EditVariantOptionname: "",
        EditVariantOptionid: "",
      },
      () => {
        this.setState({ EditVariantOption: false });
      }
    );
  };

  editVariantOpSubmit = async () => {
    const data = {
      dish_id: this.state.id,
      variant_op_id: this.state.EditVariantOptionid,
      option_name: this.state.EditVariantOptionname,
    };
    const response = await instance
      .patch(requests.fetchupdateNewVariantOption, data, {
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
      this.closeEditVariantOption();
      this.getDishItem();
    }
  };

  handleChangeAll = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    // this.toBase64(e.target.files[0]).then((data) => {
    //   this.setState({ image: data });
    // });
    const data = e.target.files[0];
    this.setState(
      { item_image: data, image: URL.createObjectURL(data) }
    );
  };

  // toBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });

  handleRemoveFile = (e) => {
    e.preventDefault();
    this.setState({ image: "", item_image: "" });
  };

  handleDeleteDish = async (id) => {
    const response = await instance
      .delete(`${requests.fetchDeleteDishInOwner}${id}`, {
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
      const { history } = this.props;
      if (history) {
        history.push(`/menu`);
      }
    }
  };

  handleUpdateDishItem = async () => {
    const {
      id,
      enable_variants,
      item_name,
      item_description,
      item_price,
      vat_percentage,
      item_available,
    } = this.state;
    const UpdatedishItem = {
      dish_id: id,
      item_name: item_name,
      item_description: item_description,
      item_price: item_price,
      vat_percentage: vat_percentage,
      item_available: item_available,
      enable_variants: enable_variants,
    };
    const fd = new FormData();
    fd.append("dish_id", id);
    if (item_name.length > 0) {
      fd.append("item_name", item_name);
    }
    if (item_description.length > 0) {
      fd.append("item_description", item_description);
    }
    if (item_price != null) {
      fd.append("item_price", item_price);
    }
    if (vat_percentage != null) {
      fd.append("vat_percentage", vat_percentage);
    }
    fd.append("item_available", item_available);
    fd.append("enable_variants", enable_variants);
    if (this.state.item_image) {
      fd.append(
        "item_image",
        this.state.item_image,
        this.state.item_image.name
      );
    }

    const response = await instance
      .patch(requests.fetchUpdateDishItem, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });
    if (response && response.data) {
      let UpdatedishItem = response.data.data;
      this.props.UPDATE_DISH_ITEM(UpdatedishItem);
      NotificationManager.success("update Successfully");
      this.setState(
        {
          image: "",
          item_image: "",
        },
        () => {
          this.getDishItem();
        }
      );
    }
  };

  handleDeleteVariantOption = async (id) => {
    const response = await instance
      .delete(`${requests.fetchDeleteVariantOption}${id}`, {
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
      this.getDishItem();
    }
  };

  AddNewVarientOptionApi = async (option_value) => {
    const { id } = this.state;
    const data = {
      dish_id: id,
      option_name: option_value,
    };
    const response = await instance
      .post(requests.fetchAddNewVariantOption, data, {
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
      this.getDishItem();
    }
  };

  handleDeleteExtras = async (id) => {
    const response = await instance
      .delete(`${requests.fetchDeleteExtras}${id}`, {
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
      this.getDishItem();
    }
  };

  getDishItem = async () => {
    const dish_id = { dish_id: this.state.id };
    const response = await instance
      .post(requests.fetchGetDishItem, dish_id, {
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
      const dish = response.data.data;
      let GetDishItemInUpdate = dish;
      this.props.GET_DISH_ITEM_IN_UPDATE(GetDishItemInUpdate);
      console.log(dish.dish.item_image.image_url);
      this.setState(
        {
          id: dish.dish._id,
          item_name: dish.dish.item_name,
          item_description: dish.dish.item_description,
          item_price: dish.dish.item_price,
          vat_percentage: dish.dish.vat_percentage,
          item_available: dish.dish.item_available,
          enable_variants: dish.dish.enable_variants,
          PrevImg: dish.dish.hasOwnProperty("item_image") ? dish.dish.item_image.image_url : process.env.REACT_APP_DEFAULT_IMAGE,
          variants:
            dish.hasOwnProperty("variants") === true ? dish.variants : null,
          extras: dish.hasOwnProperty("extras") === true ? dish.extras : null,
          variant_op:
            dish.hasOwnProperty("variant_op") === true ? dish.variant_op : null,
        }
      );
    }
  };

  componentDidMount = () => {
    this.getDishItem();
  };

  render() {
    const {
      image,
      enable_variants,
      item_name,
      item_description,
      item_price,
      vat_percentage,
      item_available,
      variant_op,
      id,
      PrevImg,
    } = this.state;
    let a;
    return (
      <>
        {/* <Row>
          <Col xs={12} lg={12} sm={12} xl={12}> */}

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
            </Container>
          </div>
          <Container className="mt--7" fluid>
            <Row>
              <Col xs={12} sm="12 mb-4" xl={6} className="card-left ">
                <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="6" sm="8">
                        <h3 className="mb-0">{i18next.t("Item Management")}</h3>
                      </Col>
                      <Col className="text-right" xs="6" sm="4">
                        <Link to="/menu">
                          <Button color="primary" size="sm">
                            {i18next.t("Back to items")}
                          </Button>
                        </Link>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <div className="pl-lg-4 px-lg-4">
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          {i18next.t("ITEM INFORMATION")}
                        </h6>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="item_name"
                          >
                            {i18next.t("Item Name")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="text"
                            placeholder={i18next.t("Item Name")}
                            name="item_name"
                            value={item_name}
                            onChange={this.handleChangeAll}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="item_description"
                          >
                            {i18next.t("Item Description")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="textarea"
                            placeholder={i18next.t("Item Description")}
                            name="item_description"
                            value={item_description}
                            onChange={this.handleChangeAll}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="item_price"
                          >
                            {i18next.t("Item Price")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="number"
                            placeholder={i18next.t("Item Price")}
                            name="item_price"
                            value={item_price}
                            onChange={this.handleChangeAll}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="vat_percentage"
                          >
                            {i18next.t("VAT percentage( calculated into item price )")}
                          </Label>
                          <Input
                            className="px-2 py-4"
                            type="number"
                            placeholder={i18next.t("Item vat_percentage")}
                            name="vat_percentage"
                            value={vat_percentage}
                            onChange={this.handleChangeAll}
                          />
                        </FormGroup>
                        <FormGroup className="text-center font-weight-bold mb-6">
                          <Label for="input-name">{i18next.t("Item Image")}</Label>
                          <div className="text-center">
                            <div
                              className="fileinput fileinput-new"
                              dataprovider="fileinput"
                            >
                              <div
                                className="fileinput-preview img-thumbnail m-auto"
                                style={{
                                  width: "20rem",
                                  height: "16rem",
                                }}
                              >
                                <img
                                  src={image.length !== 0 ? image : PrevImg}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <span className="btn btn-outline-secondary btn-file mt-3">
                                {image.length === 0 ? (
                                  <span className="fileinput-new">
                                    {i18next.t("Upload Image")}
                                  </span>
                                ) : (
                                  <span className="fileinput-exists">
                                    {i18next.t("Change")}
                                  </span>
                                )}
                                <input
                                  type="file"
                                  name="item_image"
                                  onChange={this.handleFileChange}
                                  accept="image/x-png,image/gif,image/jpeg"
                                />
                              </span>
                              {image.length !== 0 && (
                                <button
                                  onClick={this.handleRemoveFile}
                                  className="btn btn-outline-secondary fileinput-exists mt-3"
                                  data-dismiss="fileinput"
                                >
                                  {i18next.t("Remove")}
                                </button>
                              )}
                            </div>
                          </div>
                        </FormGroup>
                      </Form>
                      <Row>
                        <Col>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="resturantName"
                          >
                            {i18next.t("Item available")}
                          </Label>
                        </Col>
                        <Col className="text-right">
                          <label className="custom-toggle">
                            {item_available === true ? (
                              <input
                                defaultChecked
                                type="checkbox"
                                name="item_available"
                                onChange={this.handleChangeAll}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                name="item_available"
                                onChange={this.handleChangeAll}
                              />
                            )}
                            <span className="custom-toggle-slider rounded-circle" />
                          </label>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col>
                          <Label
                            className="mb-2 font-weight-bold"
                            for="resturantName"
                          >
                            {i18next.t("Enable variants")}
                          </Label>
                        </Col>
                        <Col className="text-right">
                          <label className="custom-toggle">
                            {enable_variants === true ? (
                              <input
                                defaultChecked
                                type="checkbox"
                                name="enable_variants"
                                value={enable_variants}
                                onChange={this.handleChangeAll}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                name="enable_variants"
                                value={enable_variants}
                                onChange={this.handleChangeAll}
                              />
                            )}

                            <span className="custom-toggle-slider rounded-circle" />
                          </label>
                        </Col>
                      </Row>
                      <div className="text-center mt-4">
                        <Button
                          color="success"
                          type="button"
                          onClick={this.handleUpdateDishItem}
                        >
                          {i18next.t("save")}
                        </Button>
                      </div>
                      <div className="text-center mt-4 mb-2">
                        <Button
                          color="danger"
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                i18next.t("Are you sure to delete this Dish?")
                              )
                            ) {
                              this.handleDeleteDish(id);
                            }
                          }}
                        >
                          {i18next.t("Delete")}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              {/* second Card */}
              <Col xs={12} sm="12 mb-4" xl={6} className="card-left ">
                {/* first card */}
                {enable_variants ? (
                  <>
                    <Card className="bg-profile shadow">
                      <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                          <Col xs="6">
                            <h3 className="mb-0">{i18next.t("Variants")}</h3>
                          </Col>
                          <Col className="text-right" xs="6">
                            {this.state.variant_op == null ? (
                              ""
                            ) : (
                              <Link
                                className="mr-3"
                                to={`/menu/item/edit/variant/${StoreDishidForEdit.index}`}
                              >
                                <Button
                                  color="secondary"
                                  size="sm"
                                  onClick={this.handleStoreVariantForOption(
                                    item_name
                                  )}
                                >
                                  {i18next.t("Add Variants")}
                                </Button>
                              </Link>
                            )}

                            <Button
                              color="success"
                              size="sm"
                              onClick={this.showVariantOptionModal}
                            >
                              {i18next.t("Add Variants Option")}
                            </Button>
                          </Col>
                        </Row>
                      </CardHeader>
                      <AddNewVarientOption
                        show={this.state.VariantOptionModal}
                        onClose={this.closeVariantOptionModal}
                        addVariantOp={this.AddNewVarientOptionApi}
                      />

                      <hr className="my-1" />
                      <CardBody>
                        <Table className="align-items-center" responsive>
                          <thead className="thead-light">
                            <tr>
                              <th>OPTIONS NAME</th>
                              <th>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.variant_op == null
                              ? ""
                              : this.state.variant_op.variant_options.map(
                                  (option, i) => {
                                    return (
                                      <>
                                        <tr>
                                          <th>{option.option_name}</th>
                                          <th>
                                            <Button
                                              color="primary"
                                              type="button"
                                              onClick={() => {
                                                this.handleEditVariantOption(
                                                  option.option_name,
                                                  option._id
                                                );
                                              }}
                                            >
                                              {i18next.t("Edit")}
                                            </Button>

                                            <Button
                                              color="danger"
                                              type="button"
                                              onClick={() => {
                                                if (
                                                  window.confirm(
                                                    i18next.t("Are you sure to delete this Variant Option")
                                                  )
                                                ) {
                                                  this.handleDeleteVariantOption(
                                                    option._id
                                                  );
                                                }
                                              }}
                                            >
                                              {i18next.t("Delete")}
                                            </Button>
                                          </th>
                                        </tr>
                                      </>
                                    );
                                  }
                                )}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                    {/* first card end */}
                    <br />
                  </>
                ) : (
                  ""
                )}

                {/* second card in second colume */}
                <Card className="bg-profile shadow">
                  <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h3 className="mb-0">{i18next.t("Extras")}</h3>
                      </Col>
                      <Col className="text-right" xs="4">
                        <Button
                          color="primary"
                          onClick={this.handleShowAddExtraModel}
                          size="sm"
                        >
                          {i18next.t("Add")}
                        </Button>
                      </Col>
                    </Row>
                  </CardHeader>
                  <hr className="my-1" />
                  <CardBody>
                    <Table className="align-items-center" responsive>
                      <thead className="thead-light">
                        <tr>
                          <th>NAME</th>
                          <th>PRICE</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.extras.map((extra, index) => {
                          const id = extra._id;

                          return (
                            <>
                              <tr>
                                <th>{extra.extras_name}</th>
                                <th>{extra.price}</th>
                                <th>
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
                                          this.handleShowEditExtraModel(
                                            id,
                                            extra.price,
                                            extra.extras_name
                                          );
                                        }}
                                      >
                                        {i18next.t("Edit")}
                                      </DropdownItem>
                                      <DropdownItem
                                        onClick={() => {
                                          this.handleDeleteExtras(id);
                                        }}
                                      >
                                        {i18next.t("Delete")}
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </th>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
          {/* <EditExtras
            open={this.state.showEditextra}
            onClose={this.handleCloseEditExtraModel}
            id={this.state.extras_id}
            extras_name={this.state.extras_name}
            price={this.state.extras_price}
            extra_variants={this.state.extras_variants}
          /> */}
          <AddExtras
            open={this.state.showAddextra}
            onClose={this.handleCloseAddExtraModel}
            ongetDishItem={this.getDishItem}
          />
          <NotificationContainer />
          {/* Edit New Variants Option modal  */}
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.EditVariantOption}
          >
            <div className="modal-header">
              <h3 className="modal-title " id="exampleModalLabel">
                {i18next.t("Edit New Variants Option")}
              </h3>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={this.closeEditVariantOption}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="p-lg-5">
                  <FormGroup className="pb-3">
                    <Input
                      className="px-2 py-4"
                      type="text"
                      placeholder={i18next.t("Add New Variants Option")}
                      name="EditVariantOptionname"
                      value={this.state.EditVariantOptionname}
                      onChange={this.handleChangeAll}
                    />
                  </FormGroup>

                  <div className="text-center my-">
                    <Button
                      className="my-3 p-3"
                      color="primary"
                      type="button"
                      onClick={this.editVariantOpSubmit}
                    >
                      {i18next.t("save")}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Modal>

          {/*  */}
          <Modal
            className="modal-dialog-centered"
            isOpen={this.state.showEditextra}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {i18next.t("Add new extras")}
              </h5>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={this.handleCloseEditExtraModel}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="p-lg-5">
                  <FormGroup className="pb-3">
                    <Label for="Name">{i18next.t("Name")}</Label>
                    <Input
                      className="px-2 py-4"
                      type="text"
                      placeholder={i18next.t("Extras Name")}
                      name="extras_name"
                      value={this.state.extras_name}
                      onChange={this.handleChangeAll}
                    />
                  </FormGroup>

                  <FormGroup className="pb-3">
                    <Label for="Price">{i18next.t("Price")}</Label>
                    <Input
                      className="px-2 py-4"
                      type="number"
                      placeholder={i18next.t("Price")}
                      name="extras_price"
                      value={this.state.extras_price}
                      onChange={this.handleChangeAll}
                    />
                  </FormGroup>

                  <div className="text-center my-">
                    <Button
                      className="my-3 p-3"
                      color="primary"
                      type="button"
                      onClick={this.onEditExtraSubmit}
                    >
                      {i18next.t("update")}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateItem);
