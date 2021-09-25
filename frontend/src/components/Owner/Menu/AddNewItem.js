import React, { Component } from "react";

// reactstrap for styling
import {
  Button,
  Modal,
  FormGroup,
  Input,
  Card,
  CardBody,
  Form,
  Label,
} from "reactstrap";

// for api integration
import instance from "../../../axios";
import requests from "../../../requests";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";


import i18next from "i18next";

let AddDish = {};
let token = null;

const mapStateToProps = (state) => {
  //   AddDish = state.AddDish;
  token = state.token;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class AddNewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_description: "",
      item_name: "",
      item_price: "",
      item_image: "",
      multerItem_image: "",
    };
  }
  handlechangeall = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleFileChange = (e) => {
    // this.toBase64(e.target.files[0]).then((data) => {
    //   this.setState({ image: data });
    // });
    const data = e.target.files[0];
    this.setState(
      { item_image: data, multerItem_image: URL.createObjectURL(data) }
    );
  };

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  handleRemoveFile = (e) => {
    e.preventDefault();
    this.setState({ item_image: "", multerItem_image: "" });
  };

  onAddDish = async () => {
    const { item_description, item_name, item_price, item_image } = this.state;
    const adddish = {
      menu_category_id: this.props.id,
      item_description: item_description,
      item_name: item_name,
      item_price: item_price,
      item_image: item_image,
    };
    

    const fd = new FormData();
    fd.append("menu_category_id", this.props.id);
    if(item_description.length > 0){
      fd.append("item_description", item_description);
    }
    if(item_name.length > 0){
      fd.append("item_name", item_name);
    }
    if(item_price.length > 0){
      fd.append("item_price", item_price);
    }
    if(item_image.length === 0){
      NotificationManager.error("You Didn't Upload Image!!!");
    }
    else{
      fd.append("item_image", item_image, item_image.name);
    }

    const response = await instance
      .post(requests.fetchAddDish, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      })
      .catch((error) => {
        let errorMessage = error.response;
        // NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });

    if (response && response.data) {
      let AddDish = response.data.data;
      this.props.ADD_DISH(AddDish);
      this.props.getMenu();
      this.props.notification("successfully update");
      this.props.afterAdd();
      this.setState({
        item_description: "",
        item_name: "",
        item_price: "",
        item_image: "",
        multerItem_image: "",
      });
    }
  };

  handleCloseModal = () => {
    this.props.onClose();
    this.setState({
      item_description: "",
      item_name: "",
      item_price: "",
      image: "",
      multerItem_image: "",
    });
  };

  render() {
    const {
      item_image,
      multerItem_image,
      item_description,
      item_name,
      item_price,
    } = this.state;
    return (
      <div>
        <Modal className="modal-dialog-centered" isOpen={this.props.show}>
          <div className="modal-header">
            <h3 className="modal-title " id="exampleModalLabel">
              {i18next.t("Add New Item")}
            </h3>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.handleCloseModal}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body p-0">
            <Card className="bg-secondary shadow border-0">
              <CardBody className="p-lg-5">
                <Form>
                  <FormGroup className="pb-3">
                    <Input
                      className="px-2 py-4"
                      type="text"
                      placeholder={i18next.t("Item Name")}
                      name="item_name"
                      value={item_name}
                      onChange={this.handlechangeall}
                    />
                  </FormGroup>
                  <FormGroup className="pb-3">
                    <Input
                      className="px-2 py-4"
                      type="textarea"
                      placeholder={i18next.t("Item Description")}
                      name="item_description"
                      value={item_description}
                      onChange={this.handlechangeall}
                    />
                  </FormGroup>
                  <FormGroup className="pb-3">
                    <Input
                      className="px-2 py-4"
                      type="number"
                      placeholder={i18next.t("Item Price")}
                      name="item_price"
                      value={item_price}
                      onChange={this.handlechangeall}
                    />
                  </FormGroup>
                  <FormGroup className="text-center font-weight-bold mb-6">
                    <Label for="input-name">{i18next.t("Item Image")}</Label>
                    <div className="text-center">
                      <div
                        className="fileinput fileinput-new"
                        dataprovider="fileinput"
                      >
                        <div className="fileinput-preview img-thumbnail">
                          <img
                            
                            src={
                              multerItem_image.length !== 0
                                ? multerItem_image : 'https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg'
                                
                            }
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="btn btn-outline-secondary btn-file mt-3">
                          {item_image.length === 0 ? (
                            <span className="fileinput-new">{i18next.t("Upload Image")}</span>
                          ) : (
                            <span className="fileinput-exists">{i18next.t("Change")}</span>
                          )}
                          <input
                            type="file"
                            name="item_image"
                            onChange={this.handleFileChange}
                            accept="image/x-png,image/gif,image/jpeg"
                            
                          />
                        </span>
                        {item_image.length !== 0 && (
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
                  <div className="text-center my-">
                    <Button
                      className="my-3 p-3"
                      color="primary"
                      type="button"
                      onClick={this.onAddDish}
                    >
                      {i18next.t("save")}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>
        <NotificationContainer />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewItem);
