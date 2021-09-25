import React from "react";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import i18next from "i18next";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
  Button,
  FormGroup,
  Input,
  InputGroup,
  Modal,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import HomeHeader from "../common/header/HomeHeader";
import "components/common/Home/Restaurant.css";

import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator";
import { connect } from "react-redux";

import instance from "../../axios";
import requests from "../../requests";
import Loader from "../common/Loader";
//Alert
import { Alert } from "reactstrap";

import "../CheckoutPayment/Checkout.css";
import HomeFooter from "components/Footers/HomeFooter";
import AddNewAddress from "./AddNewAddress";

import {Redirect} from 'react-router-dom'

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import CheckoutForm from '../CheckoutPayment/Stripe/CheckoutForm';
import { resolveTypeReferenceDirective } from "typescript";

let ownerId = null;
let userData = {};
let token = {};
let Cart_List = {};

const mapStateToProps = (state) => {
  ownerId = state.ownerId;
  userData = state.userData;
  token = state.token;
  Cart_List = state.Cart_List;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};



class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Loader: false,
      cart: [],
      item: [],
      cart_id: [],
      price: null,
      comment: "",
      address: "",
      all_user_address: userData.address,
      AddNewAddress: false,
      resturantDetail: {},
      opening_time: "",
      clos_time: "",
      delivery: undefined,
      deliveryTime: "",
      CashOnDelivery: undefined,
      OrderID:null,

      mainOrderId:null,

      razorpay_order_id:null,
      
      isStripe:false,
      stripeModal:false,
      stripeUserId:null,

      redirect:false,
      redirectIfCod:false

    };
  }

  stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_KEY}`,
  {stripeAccount: "{{CONNECTED_STRIPE_ACCOUNT_ID}}"});
  AddUserAddress = () => {
    this.setState(
      {
        AddNewAddress: true,
      }
    );
  };

  handleCloseAddressModal = () => {
    this.setState({
      AddNewAddress: false,
    });
  };

  onChangeValue = (event) => {
    console.log(`${event.target.name} === ${event.target.value}`);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeSelect(e) {
    console.log(`${e.target.name}==${e.target.value}`);
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        console.log("State ==> ", this.state.deliveryTime);
      }
    );
  }

  handleChange = (e) => {
    //console.log(`${e.target.name}==${e.target.value}`);
    this.setState(
      {
        [e.target.name]: e.target.value,
      });
  };

  handleDateOpen = (date) => {
    const CampareDate = new Date();
    console.log("0", CampareDate);
    const newDate = new Date(date);

    if (CampareDate > newDate) {
      NotificationManager.error("Please Enter Correct Time....");
      var OD = CampareDate.toISOString();
      var newDateObj = moment(OD).add(30, "m").toDate();
      var CD = newDateObj.toISOString();
      this.setState({ opening_time: OD, clos_time: CD }, () => {
        console.log(" null state date", this.state);
      });
    } else {
      var OD = newDate.toISOString();
      var newDateObj = moment(OD).add(30, "m").toDate();
      var CD = newDateObj.toISOString();
      this.setState({ opening_time: OD, clos_time: CD }, () => {
        console.log("state date", this.state);
      },() => {
        console.log("Opening Time",this.state.opening_time)
        console.log("Closing Time",this.state.clos_time)

      });
    }

    // const Hours =
    //   newDate.getHours() < 10
    //     ? `0${newDate.getHours()}`
    //     : newDate.getHours();
    // const Minutes =
    //   newDate.getMinutes() < 10
    //     ? `0${newDate.getMinutes()}`
    //     : newDate.getMinutes();
    // this.props.handleWorkingHours(
    //   `${Hours}:${Minutes}`,
    //   this.props.i,
    //   "openingTime"
    // );
  };

  getResturantDishDetail = async () => {
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
      console.log("Response Resturants ", response.data.data);
      let restaurantData = response.data.data;
      this.setState(
        {
          resturantDetail: restaurantData[0].restaurant[0], //make this response as an object
          restaurantAddress: restaurantData[0].restaurant[0].address[0]
            ? restaurantData[0].restaurant[0].address[0].user_address
            : "",
        },
        () => {
          console.log("Resturant ", this.state.resturantDetail);
          this.setState(
            {
              opening_time: this.state.resturantDetail.Working_hours[day]
                .openingTime,
              clos_time: this.state.resturantDetail.Working_hours[day]
                .closingTime,
            },
            () => {
              console.log("open time ==> ", this.state.opening_time);
              console.log("Close time ==> ", this.state.clos_time);
            }
          );
          this.setState({ Loader: false });
        }
      );
    }
  };

  getData = async () => {
    this.setState({
      Loader: true,
    });
    if (token) {
      const response = await instance
        .get(requests.fetchCartInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          let errorMessage = error.response.data.error.message;
          NotificationManager.error(errorMessage);
        });
      if (response && response.data) {
        console.log("Cart Response = ", response);

        this.setState(
          {
            cart: response.data.data.cart_data
              ? response.data.data.cart_data
              : null,
            cart_id: response.data.data.cart_data_id
              ? response.data.data.cart_data_id
              : null,
            item: response.data.data.cart_data
              ? response.data.data.cart_data.myCart
              : null,
          },
          () => {
            this.props.GET_LIST_CART(this.state.cart_id);
            this.setState({
              Loader: false,
            });
            if(this.state.cart_id === null){
              const {history} = this.props;
              console.log("History ==> ",history)
              console.log("Props ==> ",this.props)
              this.setState({
                redirect:true
              })
            }
          }
        );
      }
    }
  };

  componentDidMount = async () => {
    console.log(process.env)
    console.log("OwnerId == ", ownerId);
    console.log("userData == ", userData);
    this.getData();
    this.getResturantDishDetail();
  };
  
  onCallDeleteItem = async (data, i, item_price) => {
    this.setState({
      Loader: true,
    });

    let deducted_ammount = item_price * data.menu_item_qty;

    let cart = this.state.cart_id;

    cart.sub_total = cart.sub_total - deducted_ammount;

    cart.myCart.splice(i, 1);

    let CartDetail = {
      sub_total: this.state.cart_id.sub_total,
      owner_id: this.state.cart_id.owner_id,
      myCart: this.state.cart_id.myCart,
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
      NotificationManager.success("Successfully Added Item..!");
      this.props.GET_LIST_CART(response.data.data);
      this.getData();
      this.setState({
        Loader: false,
      });
    }
    this.setState({
      Loader: false,
    });
  };

  onCallIncreaseQuantity = async (data, i, price) => {
    this.setState({
      Loader: true,
    });
    let cart = this.state.cart_id;
    if (cart.myCart[i].menu_item_qty < 10) {
      console.log("Price == ", price);
      let increase_ammount = price;

      cart.sub_total = cart.sub_total + increase_ammount;
      cart.myCart[i].menu_item_qty++;
      cart.myCart[i].final_item_price = price;
      console.log("Cart After Increase => ", cart);
      let CartDetail = {
        sub_total: this.state.cart_id.sub_total,
        owner_id: this.state.cart_id.owner_id,
        myCart: this.state.cart_id.myCart,
      };
      console.log("Cart Body ==> ", CartDetail);
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
        this.props.GET_LIST_CART(response.data.data);
        this.getData();
      }
    } else {
      NotificationManager.error("You can't more than 10 quantity ");
    }
    this.setState({
      Loader: false,
    });
  };
  onCallDecreseQuantity = async (data, i, price) => {
    this.setState({
      Loader: true,
    });
    console.log("Price == ", price);
    let cart = this.state.cart_id;
    if (cart.myCart[i].menu_item_qty > 1) {
      let increase_ammount = price;

      cart.sub_total = cart.sub_total - increase_ammount;
      cart.myCart[i].menu_item_qty--;
      cart.myCart[i].final_item_price = price;
      console.log("Cart After Increase => ", cart);
      let CartDetail = {
        sub_total: this.state.cart_id.sub_total,
        owner_id: this.state.cart_id.owner_id,
        myCart: this.state.cart_id.myCart,
      };
      console.log("Cart Body ==> ", CartDetail);
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
        this.props.GET_LIST_CART(response.data.data);
        this.getData();
        this.setState({
          Loader: false,
        });
      }
    } else {
      this.setState({
        Loader: false,
      });
      NotificationManager.error("You can't decraese the quantity ");
    }
  };

  OnCallCancelOrder = async (e) => {
    console.log("Order Id => ",this.state.OrderID)
    let today = new Date()
    let date = today.toString()
    

    let bodyAPI = {
      "order_id":this.state.mainOrderId,
      "last_status": "Canceled by Client",
      "is_canceled":true,
      "Order_cancel_time":date
    };
    console.log("Body === ", bodyAPI);
    const response = await instance
    .post(requests.fetchCancelOrder ,bodyAPI, {
      headers: {
      Authorization: `Bearer ${token}`,
      },
    })
    .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
    });
    if (response && response.data) {
      console.log("Response = ",response)
      this.ClearCart();
    }
    else{
      console.log("Response = ",response)
    }
  }

  ClearCart = async () =>{
    const response = await instance
      .delete(requests.fetchDeleteCart,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage);
      });
    if (response && response.data) {
      //NotificationManager.success("Order is placed...!");
      this.props.GET_LIST_CART(response.data.data);
      this.getData();
      this.setState({
        Loader: false,
      });
    }
    this.setState({
      Loader: false,
    });
  }

  onClose = () => {
    this.setState({
      stripeModal:false
    })
  }

  placeOrder = async (e) => {
    let cart = this.state.cart;
    if (this.state.CashOnDelivery === "true") {
      console.log("In IF Cash On Delivery");
      let bodyAPI = {
        sub_total: cart.sub_total,
        owner_id: ownerId,
        items: cart.myCart,
        total_items: cart.myCart.length,
        total: cart.sub_total,
        is_delivery: this.state.delivery,
        is_cod: this.state.CashOnDelivery,
        ispaid: false,
        client_name: userData.name,
        //"card_number": 0,
        eta_upper_bound: this.state.opening_time,
        eta_lower_bound: this.state.clos_time,
        delivery_address: this.state.address,
        comment: this.state.comment,
      };
      console.log("Body === ", bodyAPI);
      const response = await instance
      .post(requests.fetchPlaceOrder ,bodyAPI, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
          let errorMessage = error.response.data.error.message;
          NotificationManager.error(errorMessage);
      });
      if (response && response.data) {
        console.log("Response = ",response)
        NotificationManager.success("Your Order Succesfully Placed...");
        setTimeout(() => {
          this.setState({
            OrderID:response._id,
            redirectIfCod:true
          })
          this.ClearCart();
        }, 1000);
      
        
      }
    }
    else{
      console.log("Restuarant Detail = ",this.state.resturantDetail)
      console.log("In IF Online Payment ");
      if(userData.country_name === "India")
      {
        let bodyAPI = {
          sub_total: cart.sub_total,
          owner_id: ownerId,
          items: cart.myCart,
          total_items: cart.myCart.length,
          total: cart.sub_total,
          is_delivery: this.state.delivery,
          is_cod: this.state.CashOnDelivery,
          ispaid: false,
          client_name: userData.name,
          //"card_number": 0,
          eta_upper_bound: this.state.opening_time,
          eta_lower_bound: this.state.clos_time,
          delivery_address: this.state.address,
          comment: this.state.comment,
        };
        console.log("Body === ", bodyAPI);
        const response = await instance
        .post(requests.fetchPlaceOrder ,bodyAPI, {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
            let errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage);
        });
        if (response && response.data) {
          console.log("Response = ",response)
          console.log("Restuarant Detail = ",this.state.resturantDetail)
          this.setState({
            OrderID:response.data.data.order._id,
            razorpay_order_id:response.data.data.order.razorpay_order_id
          },() => {
            console.log("Order ID State ===> ",this.state.OrderID)
          })
          this.ShowRazorPay();
        }
        else{
          console.log("Response = ",response)
        }
      }
      else{
        this.setState({
          isStripe:true
        })
        let bodyAPI = {
          sub_total: cart.sub_total,
          owner_id: ownerId,
          items: cart.myCart,
          total_items: cart.myCart.length,
          total: cart.sub_total,
          is_delivery: this.state.delivery,
          is_cod: this.state.CashOnDelivery,
          ispaid: false,
          client_name: userData.name,
          //"card_number": 0,
          eta_upper_bound: this.state.opening_time,
          eta_lower_bound: this.state.clos_time,
          delivery_address: this.state.address,
          comment: this.state.comment,
        };
        console.log("Body === ", bodyAPI);
        const response = await instance
        .post(requests.fetchStripPlaceOrder ,bodyAPI, {
          headers: {
          Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
            //et errorMessage = error.response.data.error.message;
            //NotificationManager.error(errorMessage);
        });
        if (response && response.data) {
          console.log("Response = ",response);
          let orderDetails = response.data.data.order;
          let client_secret = response.data.data.paymentIntent.client_secret;
          let stripeUserId = response.data.data.stripe_user_id;
          this.props.STORE_ORDER_DETAILS(orderDetails);
          this.props.STORE_CLIENT_SECRET_KEY(client_secret);
          this.props.STORE_STRIPE_USER_ID(stripeUserId);
          this.setState({
            stripeUserId:stripeUserId,
            OrderID:stripeUserId,
            mainOrderId:response.data.data.order._id
          },() => {
            console.log("Client Sceret Key => ",client_secret);
            console.log("Stripe User Id => ",stripeUserId);
            this.setState({
              stripeModal:true
            })

          })
        }
        else{
          console.log("Respose Of Stripe",response)
        }
      }
    }
  };

  ShowRazorPay = () => {
    console.log("Phone No = ", userData.phone)
    // e.preventDefault();
    var options = {
      "order_id": this.state.razorpay_order_id,
      "key": process.env.REACT_APP_RAZOR_PAY_KEY,
      "currency": "INR",
      "name": this.state.resturantDetail.name,
      "description": "Test Transaction",
      // "callback_url": "http://199.43.206.194:6001/api/order/raz_transfer/",
      // "callback_url": "http://localhost:6001/api/order/raz_transfer/", 
      "prefill": {
          "name": userData.name,
          "email": userData.email,
          "contact": userData.phone
      },
      handler: function (response) {
      
      if(response.razorpay_signature){
        //this.ClearCart();
        // const { history } = this.props;
        // if (history) history.push(`/orders`);
        NotificationManager.success("Your Order Successfully Placed...");
        this.ClearCart();
        this.setState({
          redirectIfCod:true
        })
      }
    },
      "notes": {
          "o_id": "response.o_id" 
      },
      "theme": { "color": "#F37254" }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open(); 
    
  }

  ShowPaymentGetway = (e) => {
    if(userData.country_name === "India"){
      this.ShowRazorPay();
    }
    else{
      this.setState({
        stripeModal:true
      })
    }  
  }

  render() {
    if(this.state.redirectIfCod){
      return (<Redirect to="/orders" />)
    }
    let total_time_map = 24 - parseInt(this.state.opening_time);
    var date = new Date();
    //console.log("Parse Int == ",parseInt(this.state.opening_time))
    date.setHours(parseInt(this.state.opening_time));
    date.setMinutes(0);
    let timeArray = [];
    let restaurant_cover_image = this.state.resturantDetail.restaurant_cover_image ? this.state.resturantDetail.restaurant_cover_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"


    // console.log("Set Hour => ",date);
    // date.setMinutes(date.getMinutes() + 30);
    // console.log(`Hour : ${date.getHours()}:${date.getMinutes()} `);
    // date.setMinutes(date.getMinutes() + 30);
    // console.log(`Hour : ${date.getHours()}:${date.getMinutes()}`);
    // date.setMinutes(date.getMinutes() + 30);
    // console.log(`Hour : ${date.getHours()}:${date.getMinutes()}`);

    for (let i = 1; i <= total_time_map * 2; i++) {
      let min1 = date.getMinutes();
      if (min1 === 0) min1 = "00";
      let demo = `${date.getHours()}:${min1}`;
      date.setMinutes(date.getMinutes() + 30);

      let min = date.getMinutes();
      if (min === 0) min = "00";
      //console.log("Min = ",min)
      timeArray.push(`${demo} - ${date.getHours()}:${min}`);
      //console.log(`${date.getHours()}:${date.getMinutes()} `);
    }
    //console.log("Time Array ",timeArray);
    
    return (
      <>
        <HomeHeader />
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "400px",
            backgroundImage:
              "url("+ restaurant_cover_image +")",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          {/* <span className="mask bg-gradient-default opacity-3" /> */}
          <Container className="d-flex align-items-center">
            <div>
              <h1
                className="display-1 text-white"
                type="button"
                style={{ cursor: "pointer" }}
                onClick={() => this.handleShowResturantDetail()}
              ></h1>
            </div>
            {/* <div>
              <h1>
              <span>
                <i className="fa fa-star" style={{color: "#dc3545"}}></i> 
                <strong> 
                &nbsp; {this.state.resturantDetail.restaurant_ratings} 
                  <span className="small"> / 5 ({this.state.resturantDetail.total_reviews})</span>
                </strong>
              </span>
              </h1>
            </div> */}

            {/* <h1 type="button" class="display-3 text-white" data-toggle="modal" data-target="#modal-restaurant-info">The Brooklyn tree</h1> */}
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

        <Container className="mt--9" fluid>
          <Row>
            <Col lg={7} sm={7} xs={12} md={7}>
              <Row>
                <Card
                  className="card-profile shadow check-out"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Items")}</h1>
                  </CardHeader>
                  <CardBody>
                    {this.state.item &&
                      this.state.item.map((data, i) => {
                        let extras_price = 0;
                        let item_price = data.menu_item_id.item_price
                          ? data.menu_item_id.item_price
                          : 0;
                        let item_replace_price = 0;
                        let total_Price = 0;
                        let flag = false;
                        let with_size = 0;
                        let without_size = 0;
                        return (
                          <>
                            <Row style={{ borderRight: "5px solid #5e72e4" }}>
                              <Col
                                className="text-center"
                                sm={6}
                                md={4}
                                lg={4}
                                xs={12}
                              >
                                <div>
                                  <img
                                    src={data.menu_item_id.item_image ? data.menu_item_id.item_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"}
                                    width="100"
                                    height="105"
                                    alt=""
                                    className="productImage"
                                  />
                                </div>
                              </Col>
                              <Col sm={6} md={8} lg={8} xs={12}>
                                <h4>
                                  {data.menu_item_id.item_name}
                                  {this.state.cart.myCart[i].variant_id.length >
                                    0 &&
                                    this.state.cart.myCart[i].variant_id.map(
                                      (item) => {
                                        if (
                                          item.variant_op_id.option_name ===
                                          "size"
                                        ) {
                                          item_replace_price = item.price;
                                          flag = true;
                                        } else {
                                          item_price = item_price + item.price;
                                          total_Price =
                                            total_Price + item.price;
                                        }
                                        return <> + {item.variant_name} </>;
                                      }
                                    )}
                                  {this.state.cart.myCart[i].extras_id.length >
                                    0 &&
                                    this.state.cart.myCart[i].extras_id.map(
                                      (item) => {
                                        extras_price =
                                          extras_price + item.price;
                                        return <> + {item.extras_name} </>;
                                      }
                                    )}
                                </h4>
                                <p className="product-item_quantity">
                                  {this.state.cart.myCart[i].menu_item_qty}
                                  &nbsp; x &nbsp; 
                                  {flag === true
                                    ? (with_size =
                                        extras_price +
                                        total_Price +
                                        item_replace_price)
                                    : (without_size =
                                        extras_price +
                                        item_price +
                                        item_replace_price)}
                                </p>
                                <ul className="pagination">
                                  {flag === true ? (
                                    <li className="page-item">
                                      <button
                                        value="1601886913"
                                        tabindex="-1"
                                        className="page-link"
                                        onClick={() => {
                                          this.onCallDecreseQuantity(
                                            data,
                                            i,
                                            with_size
                                          );
                                        }}
                                      >
                                        <i className="fa fa-minus"></i>
                                      </button>
                                    </li>
                                  ) : (
                                    <li className="page-item">
                                      <button
                                        value="1601886913"
                                        tabindex="-1"
                                        className="page-link"
                                        onClick={() => {
                                          this.onCallDecreseQuantity(
                                            data,
                                            i,
                                            without_size
                                          );
                                        }}
                                      >
                                        <i className="fa fa-minus"></i>
                                      </button>
                                    </li>
                                  )}
                                  {flag === true ? (
                                    <li className="page-item">
                                      <button
                                        value="1601886913"
                                        className="page-link"
                                        onClick={() => {
                                          this.onCallIncreaseQuantity(
                                            data,
                                            i,
                                            with_size
                                          );
                                        }}
                                      >
                                        <i className="fa fa-plus"></i>
                                      </button>
                                    </li>
                                  ) : (
                                    <li className="page-item">
                                      <button
                                        value="1601886913"
                                        className="page-link"
                                        onClick={() => {
                                          this.onCallIncreaseQuantity(
                                            data,
                                            i,
                                            without_size
                                          );
                                        }}
                                      >
                                        <i className="fa fa-plus"></i>
                                      </button>
                                    </li>
                                  )}

                                  {flag === true ? (
                                    <li className="page-item">
                                      <button
                                        value="1601886913"
                                        className="page-link"
                                        onClick={() => {
                                          this.onCallDeleteItem(
                                            data,
                                            i,
                                            with_size
                                          );
                                        }}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </li>
                                  ) : (
                                    <li className="page-item">
                                      <button
                                        value="1601886913"
                                        className="page-link"
                                        onClick={() => {
                                          this.onCallDeleteItem(
                                            data,
                                            i,
                                            without_size
                                          );
                                        }}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </Col>
                            </Row>

                            {i < this.state.item.length - 1 && <hr />}
                          </>
                        );
                      })}
                  </CardBody>
                </Card>
              </Row>

              <Row>
                <Card
                  className="card-profile shadow check-out"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Delivery / Pickup")}</h1>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <div>
                      <br />
                      <h2>
                        <div className="card-content ">
                          <div onChange={this.onChangeValue}>
                            <div className="custom-control custom-radio mb-3">
                              <input
                                type="radio"
                                value="true"
                                name="delivery"
                              />
                              &nbsp; {i18next.t("Delivery")}
                            </div>
                            <div className="custom-control custom-radio mb-3">
                              <input
                                type="radio"
                                value="false"
                                name="delivery"
                              />
                              &nbsp;{i18next.t("Picked Up")}
                            </div>
                          </div>
                        </div>
                      </h2>
                    </div>
                  </CardBody>
                </Card>
              </Row>

              <Row>
                <Card
                  className="card-profile shadow check-out"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Delivery Time")}</h1>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <div>
                      <Row>
                        <Col sm="5" md="3" xs={12}>
                          <Flatpickr
                            data-enable-time
                            placeholder={i18next.t("Time")}
                            value={this.state.opening_time}
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                              time_24hr: true,
                              disableMobile: "true",
                            }}
                            className="w-75 p-3 text-muted rounded"
                            onChange={(date) => {
                              this.handleDateOpen(date);
                            }}
                          />
                        </Col>
                        <Col sm="2" xs={12} className="text-center">
                          <p className="display-4">-</p>
                        </Col>
                        <Col sm="5" md="3" xs={12}>
                          <Flatpickr
                            data-enable-time
                            placeholder={i18next.t("Time")}
                            value={this.state.clos_time}
                            disabled
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                              time_24hr: true,
                              disableMobile: "true",
                            }}
                            className="w-75 p-3 text-muted rounded"
                          />
                        </Col>
                      </Row>

                      {/* <FormGroup>
                        <Input type="select" name="deliveryTime" id="deliveryTime"
                          onChange={(e) => this.handleChangeSelect(e)}
                          value={this.state.deliveryTime}
                        >
                          <option value="" selected>--- Select ---</option>
                          {
                            timeArray.map((data) => {
                              return(
                                <>
                                   <option value={data} >{data}</option>
                                </>
                              )
                            })
                          }
                          
                        </Input>
                      </FormGroup> */}
                    </div>
                  </CardBody>
                </Card>
              </Row>

              <Row>
                <Card
                  className="card-profile shadow check-out"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Delivery Address")}</h1>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <div>
                      <FormGroup>
                        <Input
                          type="select"
                          name="address"
                          id="address"
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.address}
                        >
                          <option value="" selected>
                            --- Select ---
                          </option>
                          {this.state.all_user_address &&
                            this.state.all_user_address.map((item) => {
                              return (
                                <option
                                  value={item.user_address}
                                  name={item.user_address}
                                >
                                  {item.user_address}
                                </option>
                              );
                            })}
                        </Input>
                        <br />
                        <Button
                          outline
                          color="success"
                          onClick={this.AddUserAddress}
                        >
                          {i18next.t("Add New")}
                        </Button>
                      </FormGroup>
                    </div>
                  </CardBody>
                </Card>
              </Row>

              <Row>
                <Card
                  className="card-profile shadow check-out"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Comment")}</h1>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <div>
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="comment"
                          id="comment"
                          placeholder={i18next.t("Your comment here...")}
                          onChange={(e) => this.handleChange(e)}
                          value={this.state.comment}
                        ></Input>
                        <br />
                      </FormGroup>
                    </div>
                  </CardBody>
                </Card>
              </Row>

              <Row>
                <Card
                  className="card-profile shadow check-out"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Restuarant Information")}</h1>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <div className="pl-lg-4">
                      <p>
                        {this.state.resturantDetail.name}
                        <br />
                        {this.state.restaurantAddress}
                        {"."}
                        <br />
                        {this.state.resturantDetail.phone}
                        <br />
                      </p>
                      <p>
                        {i18next.t("Today working hours")}: {this.state.opening_time} -{" "}
                        {this.state.clos_time}{" "}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Row>
            </Col>

            <Col lg={5} sm={5} xs={12} md={5}>
              <Row>
                <Card
                  className="card-profile shadow check-out-right"
                  style={{ width: "100%" }}
                >
                  <CardHeader className="text-left ">
                    <h1 className="display-4">{i18next.t("Checkout")}</h1>
                  </CardHeader>
                  <CardBody className="pt-0 pt-md-4">
                    <div>
                      <div>
                        <h2>
                          {" "}
                          {i18next.t("Total")}: 
                          {this.state.cart
                            ? " " + this.state.cart.sub_total
                            : 0}
                        </h2>
                      </div>
                      <hr />
                      <div>
                        <h2>
                          <div className="card-content ">
                            <div onChange={this.onChangeValue}>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  type="radio"
                                  value="true"
                                  name="CashOnDelivery"
                                />
                                &nbsp; {i18next.t("Cash On Delivery")}
                              </div>
                              <div className="custom-control custom-radio mb-3">
                                <input
                                  type="radio"
                                  value="false"
                                  name="CashOnDelivery"
                                />
                                &nbsp; {i18next.t("Online Payment")}
                              </div>
                            </div>
                          </div>
                        </h2>
                      </div>
                      <div className="text-center">
                        <br />
                        {
                        ((this.state.OrderID === null) || (this.state.CashOnDelivery === true)) 
                          ? <>
                            <Button
                              className="my-4"
                              color="success"
                              type="button"
                              disabled={
                                this.state.CashOnDelivery === undefined ||
                                this.state.delivery === undefined ||
                                this.state.deliveryTime === undefined ||
                                this.state.address === undefined
                                  ? true
                                  : false
                              }
                              onClick={(e) => this.placeOrder(e)}
                            >
                              {i18next.t("Place order")}
                            </Button>
                            </>
                          : 
                            <>
                              <Button
                                className="my-4"
                                color="success"
                                type="button"
                                onClick={(e) => this.ShowPaymentGetway(e)}
                              >
                                {i18next.t("Pay Now")}
                              </Button>
                              <Button
                                className="my-4"
                                color="danger"
                                type="button"
                                onClick={(e) => this.OnCallCancelOrder(e)}
                              >
                                {i18next.t("Cancel Order")}
                              </Button>
                            </>
                        }
                        
                      </div>
                    </div>
                    <Modal className="modal-dialog modal-lg modal-dialog-centered" isOpen={this.state.stripeModal}>
                      <div className="modal-header">
                          <h3 className="modal-title " id="exampleModalLabel">
                          {i18next.t("Payment Details")}
                          </h3>
                          <button
                          aria-label="Close"
                          className="close"
                          data-dismiss="modal"
                          type="button"
                          onClick={this.onClose}
                          >
                          <span aria-hidden={true}>×</span>
                          </button>
                      </div>
                      <div className="modal-body p-0">
                          <Card className="bg-secondary shadow border-0">
                          <CardBody className="p-lg-5">
                              <FormGroup >
                              <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY,
                                {stripeAccount: `${this.state.stripeUserId}`})}>
                                <CheckoutForm />
                               </Elements>
                              </FormGroup>

                              {/* <div className="text-center my-">
                              <Button
                                  className="my-3 p-3"
                                  color="primary"
                                  type="button"
                                  onClick={this.onAddNewAddress}
                              >
                                  Save
                              </Button>
                              </div> */}
                          </CardBody>
                          </Card>
                      </div>
                  </Modal>
                  </CardBody>
                </Card>
              </Row>
            </Col>
          </Row>
          {/* <AddAddress 
          onClose={this.handleCloseAddressModal}
          show={this.state.AddNewAddress} /> */}
        </Container>
        <br />
        <HomeFooter />
        <AddNewAddress
          onClose={this.handleCloseAddressModal}
          show={this.state.AddNewAddress}
        />
        <NotificationContainer />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
