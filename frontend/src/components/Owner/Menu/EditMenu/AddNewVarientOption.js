import React, { Component } from "react";
import Sidebar from "../../../Sidebar/Sidebar";
import routes from "../../../../ownerRoutes";
import Navbar from "../../../Navbars/AdminNavbar";

import { Link } from "react-router-dom";


import i18next from "i18next"

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
  Form,
  FormGroup,
  Input,
  Label,
  DropdownMenu,
  DropdownItem,
  Modal,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
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
let AddNewVariant = {};


const mapStateToProps = (state) => {
  token = state.token;
  StoreDishidForEdit = state.StoreDishidForEdit;
  StoreVariantForOption = state.StoreVariantForOption;
  StoreVariantOptionIdForOption = state.StoreVariantOptionIdForOption;
  AddNewVariant = state.AddNewVariant;
  GetDishItemInUpdate = state.GetDishItemInUpdate;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class AddNewVarient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option_name: "",
    }
  }

  handleChangeAll = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  addVariantOpSubmit = () => {
    this.props.addVariantOp(this.state.option_name);
    this.props.onClose();
    this.setState({option_name: ""})
  }


  

  render() {
    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={this.props.show}>
          <div className="modal-header">
            <h3 className="modal-title " id="exampleModalLabel">
              {i18next.t("Add New Variants Option")}
            </h3>
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
                  <Input
                    className="px-2 py-4"
                    type="text"
                    placeholder={i18next.t("Add New Variants Option")}
                    name="option_name"
                    value={this.state.option_name}
                    onChange={this.handleChangeAll}
                  />
                </FormGroup>

                <div className="text-center my-">
                  <Button
                    className="my-3 p-3"
                    color="primary"
                    type="button"
                    onClick={this.addVariantOpSubmit}
                  >
                    {i18next.t("save")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewVarient);
