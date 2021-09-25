import React from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import i18next from "i18next";
import {
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Form,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Modal,
  ButtonGroup,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import HomeHeader from "../header/HomeHeader";
import "components/common/Home/Restaurant.css";
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";
import ShoppingCart from "./ShoppingCart";
import { MenuItem } from "./MenuItem";
import classnames from "classnames";
import { ResturantDetail } from "./ResturantDetail";
import Loader from "../Loader"
//Alert
import { Alert } from 'reactstrap';
// Cart
import CartSlidePen from "../header/SlidePen"
import imge from '../../../assets/img/theme/Food-2.png'



let ownerId = null;
let dishDataRedux = {};
let userData = {};
let token = {};
let Cart_List = {};
const mapStateToProps = (state) => {
  ownerId = state.ownerId;
  dishDataRedux = state.dishData;
  userData = state.userData;
  token = state.token;
  Cart_List = state.Cart_List
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class Restaurant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resturantDetail: [],
      menuCategory: [],
      menuItems: [],
      working: [],
      currentDayWorking: [],
      showDetail: false,
      tabs: 1,
      flag: true,
      dishData: {},
      optionFirst: "",
      optionSecond: [],
      dishVariantOption: {},
      extrasName: [],
      menuCats: [],
      showModal: false,
      singleDishItem: {},
      firstVariantOptionsArray: [],
      secondVariantOptionsArray: [],
      firstButtonIndex: null,
      variantId: "",
      dishId: "",
      extraVariants: [],
      checked: false,
      extrasArray: [],
      variant_OP: [],
      show_second_op: false,
      show_extras: false,
      second_OP: [],
      Loader: true,
      restaurantAddress: '',
      owner_id: ownerId,

      price: null,
      option_price: [],
      extras_price: null,
      option_total_price: null,
      myCart: (Cart_List) ? Cart_List.myCart : [],
      total: null,
      optionPrice: null,
      quantity: 1,
      first_variants_option_id: null,
      variants_option_id: [],
      item: {},
      item_total_price: [],
      sub_total: (Cart_List) ? Cart_List.sub_total : 0,
      visible: false,
      showCart: false.resturantDetail,

      visibleForDish:false,
      
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  GetRestaurantDetail = async () => {
    var today = new Date();
    let day = today.getDay();
    let ownerDetail = {
      owner_id: `${ownerId}`,
      menu_category_id: "",
    };
    const response = await instance
      .post(requests.fetchRestaurantDetails, ownerDetail)
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      let restaurantData = response.data.data;
      this.setState({
        resturantDetail: restaurantData[0].restaurant[0], //make this response as an object
        menuCategory: restaurantData[0].MenuCategories[0].Menu_category,
        menuItems: restaurantData[0].Menu_items,
        currentDayWorking: restaurantData[0].restaurant[0].Working_hours[day - 1],
        restaurantAddress: restaurantData[0].restaurant[0].address[0] ? restaurantData[0].restaurant[0].address[0].user_address : ""
      },
        () => {
         
          this.setState({ Loader: false }
          )
        });
    }
  }

  componentDidMount = async () => {
    this.GetRestaurantDetail()
  };

  handleCloseItem = () => {
    this.setState({
      optionFirst: "",
      optionSecond: [],
      option_price: [],
      extras_price: null,
      option_total_price: null,
      show_second_op: false,
      show_extras: false,
      optionPrice: null,
      extras_id: [],
      extrasArray: [],
    }, () => {
      this.setState({
        showModal: false,
      })
    });
  };
  handleCloseResturantDetail = () => {
    this.setState({
      showDetail: !this.state.showDetail,
    });
  };

  handleShowResturantDetail() {
    this.setState({
      showDetail: true,
    });
  }

  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
      flag: !this.state,
    });
  };

  toggleNavsForOption = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index,
    });
  };

  handelCloseCart = () => {
    this.setState({
      showCart: false
    },()=>{
      this.GetRestaurantDetail();
    })
  }

  onShowDishDetailsFn(item, index) {
    this.setState(
      {
        showModal: true,
        Loader: true,
        dishId: item._id,
      },
      async () => {
        const dishResponseBody = {
          dish_id: item._id,
          option_value: [],
          variant_id: "",
        };
        const response = await instance
          .post(requests.fetchItemDetail, dishResponseBody)
          .catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage);
          });
        if (response && response.data) {
          let dishDetails = response.data.data.dish;
          let variants = {}
          variants = response.data.data.variants.length > 0
            ? response.data.data.variants
            : [];
          let extras =
            response.data.data.extras.length > 0
              ? response.data.data.extras
              : [];
          this.setState(
            {
              singleDishItem: dishDetails,
              variant_list: variants,
              price: dishDetails.item_price,
              extraVariants: extras,

            },
            () => {
              this.setState({ Loader: false })
            }
          );
        }
      }
    );
  }
  replacePrice(item, index) {
    this.setState(
      {
        optionFirst: item._id,
        first_variants_option_id: item._id,
        price: item.price
      })

  }
  UpdatePrice(item, index) {
    if (this.state.optionSecond[index] === item._id) {
      this.state.optionSecond[index] = null
      this.state.option_price[index] = null

    }
    else {
      this.state.optionSecond[index] = item._id
      this.state.option_price[index] = item.price
    }
    this.setState(
      {
        optionSecond: this.state.optionSecond,
        option_price: this.state.option_price
      })
    let sum = this.state.option_price.reduce(function (a, b) {
      return a + b;
    }, 0);
    this.setState({
      option_total_price: sum
    })

  }

  getParticularVariantFn(item, index, variantID, key) {
    this.setState(
      {
        firstButtonIndex: index,
      },
      async () => {
        const dishResponseBody = {
          dish_id: this.state.dishId,
          option_value: [`${item}`],
          variant_id: key === "secondExtras" ? variantID : "",
        };
        const response = await instance
          .post(requests.fetchItemDetail, dishResponseBody)
          .catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage);
          });
        if (response && response.data) {
          if (key === "firstExtras") {
            let secondVariants =
              response.data.data.variants.length > 0
                ? response.data.data.variants[0].option_values
                : [];
            this.setState(
              {
                variantId: response.data.data.variants[0].variant_id,
                secondVariantOptionsArray: secondVariants,
                optionFirst: item,
                show_second_op: true,
                show_extras: false,
              });
            if (response.data.data.variants) {
              let variant = response.data.data.variants;
              let second_Op = [];
              variant.map((item, i) => {
                item.option_values.map((data, j) => {
                  if (j != 0) {
                    second_Op.push(data.option_value);
                  }
                });
              });
              this.setState(
                {
                  second_OP: second_Op,
                }
              );
            }
          }
          if (key === "secondExtras") {
            let extras =
              response.data.data.extras.length > 0
                ? response.data.data.extras
                : [];
            this.setState({
              extraVariants: extras,
              optionSecond: item,
              show_extras: true,
            });
          }
        }
      }
    );
  }

  onToggleCheck(e, item, id) {
    let newArray = [...this.state.extrasArray, e.target.id];
    //let ex_price = [...this.state.extras_price,item.price]
    let ex_price = this.state.extras_price
    if (this.state.extrasArray.includes(e.target.id)) {
      newArray = newArray.filter((ID) => ID !== e.target.id);
      ex_price = ex_price - item.price;
    }
    else {
      ex_price = ex_price + item.price;
    }
    this.setState(
      {
        extrasArray: newArray,
        extras_price: ex_price,
      }
    );
  }

  onCallAddtoCart = async (e) => {
    
    e.preventDefault();
    if (token) {
      let id = []
      this.state.optionFirst &&
        id.push(this.state.optionFirst)

      this.state.optionSecond.map((data, i) => {
        if (data) {
          id.push(data)
        }
      })
      let total = (this.state.option_total_price + this.state.price + this.state.extras_price) * this.state.quantity;
      this.state.item_total_price.push(total);
      let sum = this.state.item_total_price.reduce(function (a, b) {
        return a + b;
      }, 0);
      if(Cart_List.hasOwnProperty("owner_id")){
        if(ownerId === Cart_List.owner_id ){
          let item = {
            "final_item_price": sum,
            "menu_item_id": this.state.dishId,
            "menu_item_qty": this.state.quantity,
            "extras_id": this.state.extrasArray,
            "variant_id": id
          }
          let item_list = this.state.myCart
          item_list.push(item);
          this.setState({
            myCart: item_list
          })

          this.setState({
            sub_total: this.state.sub_total + sum
          }, async () => {
            let CartDetail = {
              "sub_total": this.state.sub_total,
              "owner_id": `${ownerId}`,
              "myCart": this.state.myCart
            };
            const response = await instance
              .post(requests.fetchAddToCart, CartDetail, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .catch((error) => {
                let errorMessage = error.response.data.error.message;
                NotificationManager.error(errorMessage);
              });
            if (response && response.data) {
              NotificationManager.success('Successfully Added Item..!');
              this.props.GET_LIST_CART(response.data.data)
              this.handleCloseItem();
              
              this.setState({
                showCart: true
              })
            }
          })

        }
        else{
          this.setState({
            visibleForDish: !this.state.visibleForDish
          })
        }
      }
      else{
        let item = {
          "final_item_price": sum,
          "menu_item_id": this.state.dishId,
          "menu_item_qty": this.state.quantity,
          "extras_id": this.state.extrasArray,
          "variant_id": id
        }
        let item_list = this.state.myCart
        item_list.push(item);
        this.setState({
          myCart: item_list
        })

        this.setState({
          sub_total: this.state.sub_total + sum
        }, async () => {
          let CartDetail = {
            "sub_total": this.state.sub_total,
            "owner_id": `${ownerId}`,
            "myCart": this.state.myCart
          };
          const response = await instance
            .post(requests.fetchAddToCart, CartDetail, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .catch((error) => {
              let errorMessage = error.response.data.error.message;
              NotificationManager.error(errorMessage);
            });
          if (response && response.data) {
            NotificationManager.success('Successfully Added Item..!');
            this.props.GET_LIST_CART(response.data.data)
            this.handleCloseItem();
            
            this.setState({
              showCart: true
            })
          }
        })
      }
      

     
    }
    else {
      this.setState({
        visible: true
      })
      NotificationManager.error("Logged in is Required..!");
    }
  }
  onDismiss = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }
  onDismissForDish = () => {
    this.setState({
      visibleForDish: !this.state.visibleForDish
    })
  }


  render() {
    let total_price = (this.state.option_total_price + this.state.price + this.state.extras_price) * this.state.quantity
    let restaurant_cover_image = this.state.resturantDetail.restaurant_cover_image ? this.state.resturantDetail.restaurant_cover_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"
    return (
      <>
        <HomeHeader />
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "450px",boxShadow: "inset 0px 0px 150px",
            backgroundImage:
              "url("+ restaurant_cover_image +")",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-2" style={{zIndex: "-1"}}  />
          <Container className="d-flex align-items-center">
            <div>
              <h1
                className="display-1 text-white"
                type="button"
                style={{ cursor: "pointer" }}
                onClick={() => this.handleShowResturantDetail()}
              >
                <font style={{textShadow: "2px 2px #000000"}}> {this.state.resturantDetail.restaurant_Name} </font>
              </h1>
            </div>
            
          </Container>
          <div class="separator separator-bottom zindex-100">
            <svg
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-white"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </div>

        <Container fluid>
          <Row>
            <Loader open={this.state.Loader} />
            <Col xs={12} lg={12} sm={12} xl={12}>
              <Col xs={12} lg={12} sm={12} xl={12}>
                <p className="display-3 text">
                  {this.state.resturantDetail.restaurant_Description}
                </p>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={12} sm={12} xl={12}>
              <Col xs={12} lg={12} sm={12} xl={12}>
                <p className="display-5 text">
                  <i className="ni ni-watch-time"></i>
                  <span>
                    {" "}
                    {this.state.currentDayWorking.openingTime}{" "}
                  </span> -{" "}
                  <span> {this.state.currentDayWorking.closingTime} </span>
                </p>
                <p className="display-5 text">
                  <i className="ni ni-pin-3"></i>&nbsp;
                  {this.state.restaurantAddress}
                </p>
                <p className="display-5 text">
                  <i className="ni ni-mobile-button"></i>&nbsp;
                  {this.state.resturantDetail.phone}
                </p>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={12} sm={12} xl={12}>
              <Col xs={12} lg={12} sm={12} xl={12}>
                <br/>
                <Nav
                  // className="nav-fill flex-column flex-md-row tabbable sticky "
                  className="tabbable sticky "
                  id="tabs-icons-text"
                  pills
                  role="tablist"
                >
                  <NavItem>
                    <NavLink
                      aria-selected={this.state.tabs === 1}
                      className={classnames("nav-item nav-item-category", {
                        active: this.state.tabs === 1,
                      })}
                      style={{cursor:"pointer"}}
                      onClick={(e) => this.toggleNavs(e, "tabs", 1)}
                      role="tab"
                    >
                      <i className="ni ni-cloud-upload-96 mr-2" />
                      {i18next.t("All Category")}
                    </NavLink>
                  </NavItem>
                  {this.state.menuCategory.map((data, i) => {
                    return (
                      <NavItem>
                        <NavLink
                          aria-selected={this.state.tabs === i + 2}
                          className={classnames({
                            active: this.state.tabs === i + 2,
                          })}
                          style={{cursor:"pointer"}}
                          onClick={(e) => this.toggleNavs(e, "tabs", i + 2)}
                          role="tab"
                        >
                          <i className="ni ni-bell-55 mr-2" />
                          {data.category}
                        </NavLink>
                      </NavItem>
                    );
                  })}
                </Nav>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={12} sm={12} xl={12}>
              <Col xs={12} lg={12} sm={12} xl={12}>
                <TabContent
                  activeTab={this.state.tabs}
                  sm={12}
                  md={12}
                  xl={12}
                  xs={12}
                >
                  <TabPane tabId={1}>
                    <Row>
                      {this.state.menuItems.map((data, i) => {
                        return (
                          <>
                            <Col sm={12} md={12} xl={12} xs={12}>
                              <br />
                              <div>
                                <h1 className="display-2">
                                  {data.Menu_category.category}
                                </h1>
                              </div>
                            </Col>
                            {data.Menu_List.map((item, index) => {
                              return (
                                <>
                                  <Col className="col-xl-3 col-lg-6 col-md-6 col-sm-6 ">
                                    <div className="strip" style={{padding:'15px'}}>
                                      <Col>
                                        <Row>
                                          <figure
                                            className="img-wrapper img-fluid lazy"
                                            style={{ cursor: "pointer", margin: "0" }}
                                            onClick={() =>
                                              this.onShowDishDetailsFn(
                                                item,
                                                index
                                              )
                                            } 
                                          >
                                            <img
                                              src={item.item_image ? item.item_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"}
                                              loading="lazy"
                                              data-src="/default/restaurant_large.jpg"
                                              className="img-wrapper img-fluid lazy inner-img"
                                              alt=""
                                            />
                                          </figure>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <Row>
                                              <span className="res_title display-4">
                                                <b>
                                                  <strong>
                                                    {item.item_name}
                                                  </strong>
                                                </b>
                                              </span>{" "}
                                            </Row>

                                            <Row>
                                              <span className="res_description">
                                                {item.item_description}
                                              </span>
                                            </Row>
                                            <Row>
                                              <span className="res_mimimum">
                                                {" "}
                                                  {this.state.resturantDetail.currencies ? this.state.resturantDetail.currencies.symbol : '$' } {item.item_price}
                                              </span>
                                            </Row>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </div>
                                  </Col>
                                
                                </>
                              );
                            })}
                          </>
                        );
                      })}
                    </Row>
                  </TabPane>
                  {this.state.menuItems.map((data, i) => {
                    return (
                      <TabPane tabId={i + 2} >
                        <Row >
                          <Col sm={12} md={12} xl={12} xs={12}>
                            <br />
                            <div>
                              <h1 className="display-2">
                                {data.Menu_category.category}
                              </h1>
                            </div>
                          </Col>
                          {data.Menu_List.map((item, j, i) => {
                            return (
                              <>
                                <Col className="col-xl-3 col-lg-6 col-md-6 col-sm-6 ">
                                    <div className="strip" style={{padding:'15px'}}>
                                    <Col>
                                        <Row>  
                                          <figure
                                            className="img-wrapper img-fluid lazy"
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              this.onShowDishDetailsFn(item, j)
                                            }
                                          >
                                            <img
                                              src={item.item_image ? item.item_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"}
                                              loading="lazy"
                                              data-src="/default/restaurant_large.jpg"
                                              className="img-wrapper img-fluid lazy inner-img"
                                              alt=""
                                            />
                                          </figure>
                                        </Row>
                                        <Row>
                                          <Col>
                                            <Row>
                                              <span className="res_title display-4">
                                                <b>
                                                  <strong>{item.item_name}</strong>
                                                </b>
                                              </span>{" "}
                                            </Row>
                                            <Row>
                                              <span className="res_description">
                                                {item.item_description}
                                              </span>
                                            </Row>
                                            <Row>
                                              <span className="res_mimimum">
                                                {" "}
                                                {this.state.resturantDetail.currencies ? this.state.resturantDetail.currencies.symbol : '$' } {item.item_price}
                                              </span>
                                            </Row>
                                            </Col>
                                        </Row>
                                      </Col>
                                  </div>
                                </Col>
                              </>
                            );
                          })}
                        </Row>
                      </TabPane>
                    );
                  })}
                </TabContent>
              </Col>
            </Col>
          </Row>
          <Modal
            className="modal-dialog modal-lg modal-dialog-centered modal-"
            overlayClassName="Overlay"
            isOpen={this.state.showModal}
            style={{padding:'10px'}}
          >
            <Loader open={this.state.Loader} />
            <div className="modal-header">
              <h2 className="modal-title " id="exampleModalLabel">
                {this.state.singleDishItem.item_name}
              </h2>
              <button
                aria-label="Close"
                className="close"
                data-dismiss="modal"
                type="button"
                onClick={this.handleCloseItem}
              >
                <span aria-hidden={true}>×</span>
              </button>
            </div>

            <div className="modal-body p-0">
              <Card className="bg-secondary shadow border-0">
                <CardBody className="p-lg-5">
                  
                  <Row>
                    <Col md={12} lg={12} xs={12} xl={12}>
                        <div className="text-left">
                          <figure className="lazy">
                            <img
                              src={this.state.singleDishItem.item_image ? this.state.singleDishItem.item_image.image_url : "https://foodtiger.mobidonia.com/uploads/restorants/3e571ad8-e161-4245-91d9-88b47d6d6770_large.jpg"}
                              loading="lazy"
                              data-src="/default/restaurant_large.jpg"
                              className="lazy"
                              alt=""
                              style={{
                                width: "280px",
                                height: "210px",
                                objectFit: "cover",
                            }}
                            />
                          </figure>
                        </div>
                    </Col>
                    <Col md={12} lg={12} xs={12} xl={12} >
                      <form>
                        <span id="modalPrice" className="new-price">
                        {this.state.resturantDetail.currencies ? this.state.resturantDetail.currencies.symbol : '$' } {total_price}

                          {" "}
                        </span>
                        <p id="modalDescription">
                          {this.state.singleDishItem.item_description}
                         
                        </p>
                        <p id="modalDescription">
                          <strong>{i18next.t("Select your Option")} : </strong>
                        </p>
                        {
                          (this.state.variant_list) &&
                          this.state.variant_list.map((data, i) => {
                            if (data.option_name === 'size') {
                              return (
                                <>
                                  <label
                                    className="form-control-label"
                                    htmlFor="extras"
                                  >
                                    {" "}
                                    {data.option_name}{" "}
                                  </label>
                                  <br />
                                  <div className="option-area">
                                    <ButtonGroup size="lg">
                                      {
                                        data.variants.map((item, index) => {
                                          return (
                                            <Button
                                              type="button"
                                              outline
                                              color="primary"
                                              //active={this.state.firstButtonIndex===index && true}
                                              aria-selected={
                                                this.state.optionFirst === item._id
                                              }
                                              className={classnames({
                                                active:
                                                  this.state.optionFirst === item._id,
                                              })}
                                              //className={this.state.firstButtonIndex===index && 'active-button'}
                                              onClick={() => this.replacePrice(item, index)}
                                            >
                                              {item.variant_name}
                                            </Button>
                                          )
                                        })
                                      }
                                    </ButtonGroup>
                                  </div>
                                </>
                              )
                            }
                          })
                        }
                        {
                          (this.state.variant_list) &&
                          this.state.variant_list.filter(data => data.option_name != 'size').map((data, i) => {
                            return (
                              <>
                                <label
                                  className="form-control-label"
                                  htmlFor="extras"
                                >
                                  {" "}
                                  {data.option_name}{" "}
                                </label>
                                <br />
                                <div className="option-area">
                                  <ButtonGroup size="lg">
                                    {
                                      data.variants.map((item, index) => {
                                        return (
                                          <Button
                                            type="button"
                                            outline
                                            color="primary"
                                            //active={this.state.firstButtonIndex===index && true}
                                            aria-selected={
                                              this.state.optionSecond[i] === item._id
                                            }
                                            className={classnames({
                                              active:
                                                this.state.optionSecond[i] === item._id,
                                            })}
                                            //className={this.state.firstButtonIndex===index && 'active-button'}
                                            onClick={() => this.UpdatePrice(item, i)}
                                          >
                                            {item.variant_name}
                                          </Button>
                                        )
                                      })
                                    }
                                  </ButtonGroup>
                                </div>
                              </>
                            )
                          })
                        }
                        {this.state.extraVariants.length > 0 &&
                          <div>
                            <br />
                            <label
                              className="form-control-label"
                              htmlFor="extras"
                            >
                              {" "}
                                {i18next.t("Extras")}{" "}
                            </label>
                            {this.state.extraVariants.map((item, index) => {
                              return (
                                <div>
                                  <input
                                    type="checkbox"
                                    id={item._id}
                                    value={item._id}
                                    onChange={(e) => {
                                      this.onToggleCheck(e, item, index);
                                    }}
                                  // onChange={ (e) => {
                                  //   this.onChangeCheckBox(e,item,id)
                                  // }}
                                  />
                                  {"  " + item.extras_name}
                                </div>
                              );
                            })}
                          </div>
                        }

                        <div className="quantity-area">
                          <div className="form-group">
                            <br />
                            <label
                              className="form-control-label"
                              htmlFor="quantity"
                            >
                              {i18next.t("Quantity")}
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              className="form-control form-control-alternative"
                              required
                              autoFocus
                              value={this.state.quantity}
                              min="1"
                              max="10"
                              onChange={(e) => this.handleChange(e)}
                            />
                          </div>
                        </div>

                        <div className="quantity-btn">
                          <div id="addToCart1">
                            <br />
                            {userData.userType === "owner" ? (
                              <button
                                type="button"
                                className="btn btn-primary" disabled
                              >
                                {i18next.t("ADD TO CART")}
                              </button>
                            ) : (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={this.onCallAddtoCart}
                                >
                                  {i18next.t("ADD TO CART")}
                                </button>
                              )}
                          </div>
                        </div>
                      </form>
                    </Col>
                  </Row>
                  <br />
                  <Alert autofocus color="danger" isOpen={this.state.visible} toggle={this.onDismiss} >
                    {i18next.t("You are not logged in ..!")}
                  </Alert>
                  <Alert autofocus color="danger" isOpen={this.state.visibleForDish} toggle={this.onDismissForDish} >
                    You Can't Add Other Restaurant Dish..!
                  </Alert>
                </CardBody>
              </Card>
              <NotificationContainer />
            </div>
          </Modal>
          <ResturantDetail
            onClose={this.handleCloseResturantDetail}
            show={this.state.showDetail}
            state={this.state}
          />
          <CartSlidePen
            onClose={this.handelCloseCart}
            show={this.state.showCart}
            // refreshSlidePenData={this.refreshSlidePenData}
          />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurant);
