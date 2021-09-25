import React from "react";
import {
  CardBody,
  Row,
  Col,
  Button,
  Modal,

} from "reactstrap";

import i18next from "i18next"
class PreparedMode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        num: null
    }
  }

  handleNum = (t) => {
      this.setState({
          num: t
      })
  }

  handlesubmit = () => {
    this.props.passData(this.props.id,"Accepted by Restaurant", this.state.num, null);
    this.props.onClose();
    this.setState({num: null})
  }

  handleclosemodal = () =>{
    this.props.onClose();
    this.setState({num: null})
  }

  render() {

    const time = [
      5,
      10,
      15,
      20,
      25,
      30,
      35,
      40,
      45,
      50,
      55,
      60,
      65,
      70,
      75,
      80,
      85,
      90,
      95,
      100,
      105,
      110,
      115,
      120,
      125,
      130,
      135,
      140,
      145,
      150,
    ];
    return (
      <>
        <Modal className="modal-dialog-centered" isOpen={this.props.onshow}>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {i18next.t("Order time to prepare in minutes")}
            </h5>
          </div>
          <div className="modal-body">
            <CardBody >
              <Row>
                {time.map((t, index) => (
                  <Col
                    key={index}
                    className="mt-3 mr-2"
                    sm={3}
                    xl={2}
                    lg={2}
                    md={2}
                    xs={5}
                  >
                    <Button color="primary" outline type="button" active={(this.state.num === t) ? true : false} onClick={() => {this.handleNum(t)}}>
                      {t}
                    </Button>
                  </Col>
                ))}
              </Row>
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
            <Button color="primary" type="button" onClick={this.handlesubmit}>
              {i18next.t("save")}
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}


export default PreparedMode;
