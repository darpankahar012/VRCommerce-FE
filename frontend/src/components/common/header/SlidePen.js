import React, { Component, useState } from "react";
import { render } from "react-dom";
import SlidingPane from "react-sliding-pane";
// import "react-sliding-pane/dist/react-sliding-pane.css";
import "components/common/header/SlidePen.css";
import i18next from "i18next";
import  {Card,
CardHeader,
CardBody,
CardFooter,
Row,
Col,
Container
} from "reactstrap";
import Button from "reactstrap/es/Button";

// For Redux Data 
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../redux/bindActionCreator";
import {connect} from "react-redux";
import instance from "../../../axios";
import requests from "../../../requests";

// For Notification
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { withRouter, Link } from "react-router-dom";

//Loader
import Loader from "../Loader"

let token=null;
let userData=null;
let ownerId = null;


const mapStateToProps = state => {
    token=state.token
    userData=state.userData

};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActCreators, dispatch)
};


export class CartSlidePen extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         cart:[],
         item:[],
         cart_id:[],
         price:null,
         Loader: true,
         ownerData:{}
      }
    }
    getData = async () => {
        this.setState({
            Loader: true,
        })
        if(userData.userType === "client" )
        {
            const response = await instance.get(requests.fetchCartInfo,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
            }).catch((error) => {
                let errorMessage = error.response.data.error.message;
                NotificationManager.error(errorMessage)
            });
            if(response && response.data){
                
                this.setState({
                    cart:(response.data.data.cart_data) ? response.data.data.cart_data : null,
                    cart_id:(response.data.data.cart_data_id) ? response.data.data.cart_data_id : null,
                    item:(response.data.data.cart_data) ? response.data.data.cart_data.myCart : null
                }, () => {
                    this.props.GET_LIST_CART(this.state.cart_id)
                    this.setState({
                        Loader: false,
                    })
                })
            }
        }
        
    }

    componentDidMount = async () => {
        this.getData();
    }

    componentDidUpdate(prevProps){
        if(this.props.show !== prevProps.show){
            this.getData();
        }
    }

    onCallDeleteItem = async (data,i,item_price) => {
        this.setState({
            Loader: true,
        })
      
        let deducted_ammount = item_price * data.menu_item_qty
        
        let cart = this.state.cart_id;
        
        cart.sub_total = cart.sub_total - deducted_ammount;
        
        cart.myCart.splice(i,1)

        let CartDetail = {
            "sub_total": this.state.cart_id.sub_total,
            "owner_id": this.state.cart_id.owner_id,
            "myCart":this.state.cart_id.myCart
          };
        
        const response = await instance
            .post(requests.fetchAddToCart ,CartDetail, {
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
                this.getData();
                this.setState({
                    Loader: false,
                })
            }
            this.setState({
                Loader: false,
            })
    }

    onCallIncreaseQuantity = async (data,i,price) => {
        this.setState({
            Loader: true,
        })
        let cart = this.state.cart_id;
        if (cart.myCart[i].menu_item_qty < 10)
        {
            let increase_ammount = price;
            
            cart.sub_total = cart.sub_total + increase_ammount;
            cart.myCart[i].menu_item_qty++;
            cart.myCart[i].final_item_price = price
            let CartDetail = {
                "sub_total": this.state.cart_id.sub_total,
                "owner_id": this.state.cart_id.owner_id,
                "myCart":this.state.cart_id.myCart
            };
            const response = await instance
                .post(requests.fetchAddToCart ,CartDetail, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                })
                .catch((error) => {
                    let errorMessage = error.response.data.error.message;
                    NotificationManager.error(errorMessage);
                });
                if (response && response.data) {
                    this.props.GET_LIST_CART(response.data.data)
                    this.getData();
                }
        }
        else {
            NotificationManager.error("You can't more than 10 quantity ")
        }
        this.setState({
            Loader: false,
        })
    }
    onCallDecreseQuantity = async (data,i,price) => {
        this.setState({
            Loader: true,
        })
         let cart = this.state.cart_id;
        if (cart.myCart[i].menu_item_qty > 1)
        {
            let increase_ammount = price;
            
            cart.sub_total = cart.sub_total - increase_ammount;
            cart.myCart[i].menu_item_qty--;
            cart.myCart[i].final_item_price = price
            let CartDetail = {
                "sub_total": this.state.cart_id.sub_total,
                "owner_id": this.state.cart_id.owner_id,
                "myCart":this.state.cart_id.myCart
            };
            const response = await instance
                .post(requests.fetchAddToCart ,CartDetail, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                })
                .catch((error) => {
                    let errorMessage = error.response.data.error.message;
                    NotificationManager.error(errorMessage);
                });
                if (response && response.data) {
                    this.props.GET_LIST_CART(response.data.data)
                    this.getData();
                    this.setState({
                        Loader: false,
                    })
                }
        }
        else
        {
            this.setState({
                Loader: false,
            })
            NotificationManager.error("You can't decraese the quantity ")
        }
        
    }
    
    render(){
        return (
            <>
            <center>                 
                <SlidingPane
                    className="some-custom-class sidenav-cart sidenav-cart-open"
                    overlayClassName="some-custom-overlay-class"
                    isOpen={this.props.show}
                    //title="Shopping Cart"
                    //subtitle="Optional subtitle."
                    //onRequestClose={this.props.onClose}
                >
                    <CardHeader className="border-0">
                    <div className="d-flex justify-content-between">
                        <div className="md-10 sm-10 lg-10 xs-10 xl-10">
                            <h1 className="mb-0">{i18next.t("Shopping Cart")}</h1>  
                        </div>
                        <div className="md-2 sm-2 lg-2 xs-2 xl-2">
                            <Row>
                                <Col>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                         type="button"
                                        onClick={this.props.onClose}
                                    >
                                        <span aria-hidden={true}> 
                                            <strong> × </strong>
                                        </span>
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    </CardHeader>
                    <CardBody>
                        <Container>
                        <Row className="">
                            <Loader open={this.state.Loader} />
                            {
                                this.state.item &&
                                this.state.item.map((data,i) => {
                                    let extras_price = 0;
                                    let item_price = data.menu_item_id.item_price ? data.menu_item_id.item_price : 0;
                                    let item_replace_price=0;
                                    let total_Price = 0;
                                    let flag = false;
                                    let with_size = 0;
                                    let without_size = 0;
                                    
                                    return(
                                        <>
                                        <Col sm={6} md={4} lg={4} xs={6}>
                                            <div className="justify-content-center">
                                              
                                                <img src={data.menu_item_id.item_image ? data.menu_item_id.item_image.image_url : "https://vrcommerce-image-storage.s3.us-east-2.amazonaws.com/default.jpg"}
                                                 width="100" height="105" alt="" className="productImage" />
                                            </div>
                                        </Col>
                                        <Col sm={6} md={8} lg={8} xs={6}>
                                            <h4>
                                                {data.menu_item_id.item_name} 
                                                {
                                                    (this.state.cart.myCart[i].variant_id.length > 0) &&
                                                        this.state.cart.myCart[i].variant_id.map((item)=>{
                                                            if(item.variant_op_id.option_name === 'size'){
                                                                item_replace_price = item.price
                                                                flag=true
                                                            }
                                                            else{
                                                                item_price = item_price + item.price 
                                                                total_Price = total_Price + item.price
                                                            }
                                                        return(
                                                            <> + {item.variant_name} </>
                                                        )
                                                    })
                                                }
                                                {
                                                    (this.state.cart.myCart[i].extras_id.length > 0) &&
                                                    this.state.cart.myCart[i].extras_id.map((item)=>{
                                                        extras_price = extras_price + item.price
                                                        return(
                                                        <> + {item.extras_name } </>
                                                    )
                                                 })
                                                }
                                            </h4 >
                                            <p className="product-item_quantity">
                                                { this.state.cart.myCart[i].menu_item_qty }
                                                &nbsp; x  &nbsp; 
                                                {
                                                    (flag===true) ? (with_size = extras_price + total_Price + item_replace_price)
                                                    : (without_size = extras_price + item_price + item_replace_price)
                                                }  
                                            </p>
                                            <ul className="pagination">
                                                    { (flag===true) ? 
                                                        <li className="page-item">
                                                            <button value="1601886913" tabindex="-1" className="page-link"
                                                                onClick={() => {this.onCallDecreseQuantity(data,i,with_size)}}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                        </li>
                                                    :
                                                        <li className="page-item">
                                                            <button value="1601886913" tabindex="-1" className="page-link"
                                                                onClick={() => {this.onCallDecreseQuantity(data,i,without_size)}}
                                                            >
                                                                <i className="fa fa-minus"></i>
                                                            </button>
                                                        </li>
                                                    }
                                                    { (flag===true) ?   
                                                        <li className="page-item">
                                                            <button value="1601886913" className="page-link"
                                                                onClick={() => {this.onCallIncreaseQuantity(data,i,with_size)}}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </li>
                                                    :
                                                        <li className="page-item">
                                                            <button value="1601886913" className="page-link"
                                                                onClick={() => {this.onCallIncreaseQuantity(data,i,without_size)}}
                                                            >
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                        </li>
                                                    }
                                    
                                                    { (flag===true) ? 
                                                    <li className="page-item">
                                                        <button value="1601886913" className="page-link"
                                                            onClick={() => {this.onCallDeleteItem(data,i,with_size)} }
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </li>
                                                  :
                                                    <li className="page-item">
                                                        <button value="1601886913" className="page-link"
                                                            onClick={() => {this.onCallDeleteItem(data,i,without_size)} }
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </li> 
                                                } 
                                            </ul>
                                        </Col>
                                        </>
                                    )
                                })
                            } 
                        </Row>
                        </Container>
                    </CardBody>
                    <CardFooter>
                        <div id="totalPrices">
                            <div className="card card-stats mb-4 mb-xl-0">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <h3><span><strong> {i18next.t("Sub Total")}:  </strong></span> 
                                            <span className="ammount">
                                                <strong> 
                                                    {
                                                        this.state.cart ?
                                                            this.state.cart.sub_total
                                                        :
                                                            0                                                            
                                                    }
                                                </strong>
                                            </span></h3>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            <br/> 
                            <div>
                            <Link to='/cart-checkout'>
                                <Button block color="primary" size="lg" type="button"
                                    
                                >
                                    {i18next.t("Checkout")}
                                </Button>
                            </Link>
                            
                            </div>
                        </div>
                    </CardFooter>
                    <NotificationContainer />
                </SlidingPane>
            </center>
            </>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps) ( CartSlidePen )

{/* <Col sm={6} md={4} lg={4} xs={6}>
                                <div className="justify-content-center">
                                    <img src="https://foodtiger.mobidonia.com/uploads/restorants/93641a19-dba6-4010-a852-0e88da83a01f_thumbnail.jpg" width="100" height="105" alt="" className="productImage" />
                                </div>
                                
                            </Col>
                            <Col sm={6} md={8} lg={8} xs={6}>
                                <h5>Salad Napoli (350g) + Tuna + olive</h5 >
                                <p className="product-item_quantity">1 x $11.49</p>
                                <ul className="pagination">
                                    <li className="page-item">
                                        <button value="1601886913" tabindex="-1" className="page-link">
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </li> 
                                    <li className="page-item">
                                        <button value="1601886913" className="page-link">
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </li> 
                                    <li className="page-item">
                                        <button value="1601886913" className="page-link">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </li>
                                </ul>
                            </Col> */}