import React from "react";
// react plugin used to create google maps
import i18next from "i18next";
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
} from "reactstrap";

import ReactDatetime from "react-datetime";
import Loader from "../common/Loader";

// For Redux Data
import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../axios";
import requests from "../../requests";
import axios from 'axios'

import AddNewAddress from "../Client/AddNewAddress";

// Notification
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let token = null;


const mapStateToProps = (state) => {
  token = state.token;
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};
class MyAssress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: [],
      LoaderShow: false,
      AddNewAddress: false,
    };
  }
  handleCloseAddressModal = () => {
    this.setState({
      AddNewAddress: false,
    }, () => {
      this.getAddressList();
    });

  };

  getAddressList = async() => {
    this.setState ({ LoaderShow: true })
    const response = await instance
      .get(requests.fetchAddressList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      this.setState(
        {
          datas: response.data.data.address,
        },
        () => {
          this.setState({ LoaderShow: false });
        }
      );
    }
  }

  componentDidMount = async () => {
    this.getAddressList();
  };

  redirectNewAddress = () => {
    this.setState({
      AddNewAddress:true
    })
  };
  

  onCallDelete = async (id) => {
    const response = await instance
      .delete(requests.fetchDeleteAddress + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      NotificationManager.success("Successfully Deleted");
      this.getAddressList();
    }
  };
  render() {
   
    return (
      <>
        {/* header */}
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
          <Loader open={this.state.LoaderShow} />
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("My Address")}</h1>
                    </div>
                    <div className="md-5">
                      <Row>
                        <Col>
                          <Button
                            color="primary"
                            size="sm"
                            type="button"
                            onClick={this.redirectNewAddress}
                          >
                            {i18next.t("Add New Address")}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Address</th>
                      <th scope="col">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.datas.length > 0 ?
                        this.state.datas.map((item, index) => (
                        <tr key={index + 1}>
                          <td>{item.user_address}</td>
                          <td>
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
                      ))
                    :
                      <tr><td>{i18next.t("Data Not Found ..!")}</td></tr>
                  }
                  </tbody>
                </Table>

               </Card>
            </div>
          </Row>
          <NotificationContainer />
          <AddNewAddress
            onClose={this.handleCloseAddressModal}
            show={this.state.AddNewAddress}
          />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAssress);
