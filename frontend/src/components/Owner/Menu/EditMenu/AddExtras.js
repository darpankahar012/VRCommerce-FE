import React, { Component } from "react";

//reactstrap
import {
  Button,
  Modal,
  FormGroup,
  Input,
  Card,
  CardBody,
  Label,
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
let GetDishItemInUpdate = {};

const mapStateToProps = (state) => {
  token = state.token;
  StoreDishidForEdit = state.StoreDishidForEdit;
  GetDishItemInUpdate = state.GetDishItemInUpdate;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class AddExtras extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dish_id: StoreDishidForEdit.id,
      extras_name: "",
      price: "",
      variants: [],
      GetDishItemInUpdate: GetDishItemInUpdate,
    };
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };



  handleAddExtras = async () => {
    const body = {
      dish_id: this.state.dish_id,
      extras_name: this.state.extras_name,
      price: this.state.price,
    };
    const response = await instance
      .post(requests.fetchAddExtras, body, {
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
      let AddExtras = response.data.data;
      this.props.ADD_EXTRAS(AddExtras);
      this.props.ongetDishItem();
      this.props.onClose();
    }
  };

  render() {
    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={this.props.open}>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {i18next.t("Add new extras")}
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.props.onClose}
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
                    placeholder={i18next.t("Name")}
                    name="extras_name"
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <FormGroup className="pb-3">
                  <Label for="Price">{i18next.t("Price")}</Label>
                  <Input
                    className="px-2 py-4"
                    type="number"
                    placeholder={i18next.t("Price")}
                    name="price"
                    onChange={this.handleChange}
                  />
                </FormGroup>

                <div className="text-center my-">
                  <Button
                    className="my-3 p-3"
                    color="primary"
                    type="button"
                    onClick={this.handleAddExtras}
                  >
                    {i18next.t("save")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
          <NotificationContainer />
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddExtras);
