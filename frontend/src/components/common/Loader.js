import React, { Component } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  ModalBody,
  Row,
  Col,
  Spinner,
  Container,
} from "reactstrap";

import HashLoader from "react-spinners/HashLoader";

import { css } from "@emotion/core";

// import LoaderLogo from "../../assets/img/Loader/hourglass-loader.gif";

const override = css`
  display: block;
  margin: 3rem auto;
  border-color: red;
  @media (max-width: 420px) {
    size: 70;
  }
`;

export class Loader extends Component {
  render() {
    return (
      <>
        {/* <Modal
          className="modal-dialog-centered "
          isOpen={true}
        >
          <div className="modal-body">
            
          </div>
        </Modal> */}
        {/*  */}
        
          <Modal isOpen={this.props.open}   className="modal-dialog-centered" style={{ width:"65%", margin:"0 auto"}}>
            <ModalBody>
              <HashLoader css={override} size={100} color={"#11cdef"} />
            </ModalBody>
          </Modal>
        
      </>
    );
  }
}

export default Loader;
