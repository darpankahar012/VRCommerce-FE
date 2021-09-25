import React, { Component } from "react";
import {
  CardBody,
  Label,
  Button,
  Modal,
  FormGroup,
  Input,
} from "reactstrap";


import i18next from "i18next";

export class AssignToDriver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      driver: "",
    };
  }

  handleclosemodal = () =>{
    this.props.onClose();
    this.setState({driver: null})
  }


  handleSubmitDriver = () => {
    this.props.passData(this.props.id, "Assigned to Driver", this.state.driver);
    this.props.onClose();
    this.setState({num: null})
  }

  handleDriverValue = (e) => {
    this.setState({
        driver: e.target.value
    })
}

  render() {
    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={this.props.onshow}>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {i18next.t("Assign Driver")}
            </h5>
          </div>
          <div className="modal-body">
            <CardBody>
              <FormGroup>
                <Label for="AssignToDriver">{i18next.t("Select Driver")}</Label>
                <Input type="select" name="select" value={this.state.driver} id="AssignToDriver" onChange={this.handleDriverValue}>
                <option value="" selected disabled>--Select Driver--</option>
                  {
                    this.props.driverData.map((driver,index) => {
                      
                      return (
                        <option value={driver._id} >{driver.name}</option>
                      )
                    })
                  }
                </Input>
              </FormGroup>
            </CardBody>
          </div>
          <div className="modal-footer">
            <Button
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={this.handleclosemodal}
            >
              {i18next.t("Close")}
            </Button>
            <Button color="primary" type="button" onClick={this.handleSubmitDriver}>
              {i18next.t("save")}
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default AssignToDriver;
