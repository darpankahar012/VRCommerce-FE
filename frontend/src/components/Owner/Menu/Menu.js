import React, { Component } from "react";

// React-router
import { Link } from "react-router-dom";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";

import i18next from "i18next";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

// for api integration
import instance from "../../../axios";
import requests from "../../../requests";

// Reactstarp for styling
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  CardBody,
  Alert,
  CardImg,
  CardTitle,
  CardText,
  Badge,
} from "reactstrap";

// inner component
import AddNewCategory from "./AddNewCategory";
import AddNewItem from "./AddNewItem";
import Loader from "../../common/Loader";
import UpdateCategory from "./UpdateCategory";

let getrestaurantmenu = {};
let token = null;

const mapStateToProps = (state) => {
  getrestaurantmenu = state.getrestaurantmenu;
  token = state.token;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
      Loader: true,
      AddNewCategory: false,
      AddNewItem: false,
      menu_temp_id: "",

      UpdateCategory: false,
      flagUpdateCategory: false,

      category_id: "",
      selectedCategory: "",
      selectedImage: "",
    };
  }

  hadnleStoreDishidForEdit = (id, index) => {
    const detail = {
      id: id,
      index: index,
    };
    this.props.STORE_DISH_ID_FOR_EDIT(detail);
  };

  handleShowCategory = () => {
    this.setState({ AddNewCategory: !this.state.AddNewCategory });
  };

  handleShowUpdateCategory = (menu) => {
    this.setState({
      selectedCategory: menu.category,
      selectedImage: menu.category_image.image_url,
      category_id: menu._id,
      flagUpdateCategory: true,
    });
    this.setState({ UpdateCategory: !this.state.UpdateCategory });
  };

  handleCloseCategory = () => {
    this.setState({
      AddNewCategory: !this.state.AddNewCategory,
    });
  };

  handleCloseUpdateCategory = () => {
    this.setState({
      flagUpdateCategory: false,
      UpdateCategory: !this.state.UpdateCategory,
    });
  };

  closeAfterAddCategory = () => {
    this.setState({ AddNewCategory: !this.state.AddNewCategory });
  };

  closeAfterAddDish = () => {
    this.setState({ AddNewItem: !this.state.AddNewItem });
  };

  handleShowItem = (id) => {
    this.setState({ AddNewItem: !this.state.AddNewItem, menu_temp_id: id });
  };

  handleCloseItem = () => {
    this.setState({
      AddNewItem: !this.state.AddNewItem,
    });
  };

  handleNotification = (message) => {
    NotificationManager.success(message);
  };

  ondelete = async (id) => {
    const response = await instance
      .delete(`${requests.fetchDeleteMenuCategory}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.error.message;
        NotificationManager.error(errorMessage);
        console.log(errorMessage);
      });

    if (response) {
      this.getMenu();
      NotificationManager.warning("Successfully Deleted....");
    }
  };

  getMenu = async () => {
    const response = await instance
      .get(requests.fetchRestaurantMenu, {
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
      const menu_data = response.data.data;
      this.setState({ menu: menu_data }, () => {
        this.setState({ Loader: false });
      });
    }
  };

  componentDidMount = () => {
    this.getMenu();
  };

  render() {
    const { menu } = this.state;
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{ width: "100%" }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container
            className="d-flex align-items-center"
            style={{ width: "100%" }}
            fluid
          >
            <div className="header-body">
              {/* Card stats */}
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
            <Col>
              <h1 className="display-2 text-white">
                {i18next.t("Product detail")}
              </h1>
            </Col>
          </Container>
        </div>

        <Container className="mt--8" fluid>
          {/* <Loader open={this.state.Loader} /> */}
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0 p-4">
              <Row className="align-items-center">
                <Col sm={12} md={8}>
                  <h3 className="mb-0">{i18next.t("Product Management")} </h3>
                </Col>
                <Col sm="12 mt-2" lg="4 text-right">
                  <Button
                    style={{ fontSize: "1rem" }}
                    color="primary"
                    onClick={this.handleShowCategory}
                    size="sm"
                  >
                    +
                  </Button>
                  {/* <Button
                    style={{ fontSize: "1rem" }}
                    color="primary"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Import From CSV
                  </Button> */}
                </Col>
              </Row>
            </CardHeader>
            {menu.map((menu) => {
              const id = menu._id;
              return (
                <CardBody className="mx-3">
                  <Alert className="alert-default">
                    <Row className="align-items-center">
                      <Col className="display-4" md="8" xs="12">
                        {menu.category}
                        {"  "}
                        <Button
                          style={{ fontSize: "1rem" }}
                          color="primary"
                          onClick={() =>
                            this.handleShowUpdateCategory(
                              menu,
                              menu.category,
                              menu.category_image
                            )
                          }
                          size="sm"
                        >
                          {/* <i className="fas fa-marker"></i> */}
                          <i class="fas fa-edit"></i>
                        </Button>
                      </Col>
                      <Col md="4 text-right" xs="12 text-left">
                        <Button
                          style={{ fontSize: "1rem" }}
                          color="primary"
                          onClick={() => {
                            this.handleShowItem(id);
                          }}
                          size="sm"
                        >
                          +
                        </Button>
                        <Button
                          style={{ fontSize: "1rem" }}
                          color="danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure to delete this Menu Category?"
                              )
                            ) {
                              this.ondelete(id);
                            }
                          }}
                          size="sm"
                        >
                          <i className="ni ni-air-baloon"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Alert>
                  <Row className="justify-content-center">
                    <Col lg={12}>
                      <Row className="row-grid">
                        {menu.Dish_List.map((dishList, index) => {
                          const path = `/menu/item/edit/${index + 1}`;
                          const ImagePath = dishList.item_image.image_url
                            ? dishList.item_image?.image_url
                            : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg";
                          return (
                            <Col sm={6} md={6} xl="3 mt-3" lg={4}>
                              <Link
                                to={{
                                  pathname: path,
                                  state: { id: dishList._id },
                                }}
                              >
                                <Card
                                  onClick={() => {
                                    this.hadnleStoreDishidForEdit(
                                      dishList._id,
                                      index + 1
                                    );
                                  }}
                                >
                                  <CardImg alt="..." src={`${ImagePath}`} top />
                                  <CardBody>
                                    <CardTitle className="h2 text-primary text-uppercase">
                                      {dishList.item_name}
                                    </CardTitle>
                                    <CardText>
                                      {dishList.item_description}
                                    </CardText>
                                    <Badge color="primary" pill>
                                      {dishList.item_price}
                                    </Badge>
                                    <p className="mt-3 mb-o text-sm">
                                      {dishList.item_available ? (
                                        <span className="text-success mr-2">
                                          {" "}
                                          {i18next.t("AVAILABLE")}{" "}
                                        </span>
                                      ) : (
                                        <span className="text-danger mr-2">
                                          {i18next.t("UNAVAILABLE")}
                                        </span>
                                      )}
                                    </p>
                                  </CardBody>
                                </Card>
                              </Link>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              );
            })}
          </Card>
          <NotificationContainer />
        </Container>
        <AddNewCategory
          onClose={this.handleCloseCategory}
          show={this.state.AddNewCategory}
          notification={this.handleNotification}
          getMenu={this.getMenu}
          afterAdd={this.closeAfterAddCategory}
        />
        {this.state.flagUpdateCategory && (
          <UpdateCategory
            onClose={this.handleCloseUpdateCategory}
            show={this.state.UpdateCategory}
            notification={this.handleNotification}
            getMenu={this.getMenu}
            selectedCategory={this.state.selectedCategory}
            selectedImage={this.state.selectedImage}
            category_id={this.state.category_id}
          />
        )}

        <AddNewItem
          onClose={this.handleCloseItem}
          show={this.state.AddNewItem}
          notification={this.handleNotification}
          getMenu={this.getMenu}
          afterAdd={this.closeAfterAddDish}
          id={this.state.menu_temp_id}
        />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
