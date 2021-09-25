import React, { Component } from "react";

//
import { Button, Modal, FormGroup, Input, 
Card, CardBody, Row ,Col , NavItem,ButtonGroup,
NavLink,
Nav} from "reactstrap";
import i18next from "i18next"
// for api integration
import instance from "../../../axios";
import requests from "../../../requests";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../redux/bindActionCreator";
import { connect } from "react-redux";
import classnames from "classnames";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let dishData = {};
let ownerId = null;


const mapStateToProps = (state) => {
  ownerId = state.ownerId
  dishData = state.dishData
  
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity:'',
      navPills: 0,
      dishDetail:{},
      variants:{},
      extras:{},
      option:[],
    };
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  }
  handleChange(e) {
    this.setState({
        [e.target.name]: e.target.value
    })
  };
  callGetDishApi = async (bodyAPI) => {
    const response = await instance.post(requests.fetchItemDetail,bodyAPI).catch((error) => {
      let errorMessage = error.response.data.error.message;
      NotificationManager.error(errorMessage)
    });
    if(response && response.data){
      this.setState({
        dishDetail:response.data.data.dish,
        variants:response.data.data.variants,
        extras:response.data.data.extras,
        option:response.data.data.variant_op
      })
    }
  } 
  componentDidMount = () => {
     let id = this.props.id
    
     let bodyAPI  = {
       "dish_id":"5f7a3f0d9fc9515bee709c87",
       "option_value":[],
       "variant_id":""    
     }
     this.callGetDishApi(bodyAPI);  
   }

  render() {
    let dishVariantOption = this.props.dishVariantOption;
  
    return (
      <>
      <Row>
      <Col style={{width:"100px"}}>    
        <Modal className="modal-dialog modal-lg modal-dialog-centered modal-" overlayClassName="Overlay" isOpen={this.props.show}>
          <div className="modal-header">
            <h2 className="modal-title " id="exampleModalLabel">
              {this.props.dishData.item_name}
            </h2>
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
                <Row>
                  <Col md={6} lg={6} xs={12} xl={6} >
                    <div>
                    <figure className="img-wrapper img-fluid lazy">
                        <img src="https://foodtiger.mobidonia.com/uploads/restorants/3e571ad8-e161-4245-91d9-88b47d6d6770_large.jpg" 
                            loading="lazy" data-src="/default/restaurant_large.jpg" 
                            className="img-wrapper img-fluid lazy" alt=""/>
                    </figure>
                    </div>
                  </Col>
                  <Col md={6} lg={6} xs={12} xl={6} >
                    <form>
                      <span id="modalPrice" className="new-price">$ {this.state.dishDetail.item_price} </span>
                      <p id="modalDescription"> 
                        {this.props.dishData.item_description}
                      </p>
                      <div className="option-area">
                        <label form-control-label> {i18next.t("Select your Option")}</label><br/>
                        
                        {
                          this.state.dishDetail.enable_variants 
                          && 
                          this.state.option.map((data,i)=>{
                            return ( 
                              <Row>
                                <Col md={12} lg={12} xs={12} xl={12}>
                                  <div className="variant">
                                    <p> <b> {data.option_name} </b></p>
                                    {
                                        this.state.variants.map((option,index) => {
                                         option.option_values.map((data1,j) => {
                                           if(data1.variant_op_id == data.option_id){
                                             
                                           } 
                                         })
                                       })
                                      }
                                  </div>
                                </Col>
                              </Row>
                            )
                            

                          })
                        }
                        {
                          this.state.dishDetail.enable_variants 
                          && 
                          <Row >
                            <Col md={12} lg={12} xs={12} xl={12}>
                            <div className="variant">
                            <p> <b>{i18next.t("Size")}</b></p>
                            <ButtonGroup size="lg" > 
                            <Button type="button" outline color="primary"
                              aria-selected={this.state.navPills === 2}
                              className={classnames({
                                active: this.state.navPills === 1
                              })}
                              onClick={e => this.toggleNavs(e, "navPills", 1)}
                              >
                              {i18next.t("SMALL")}
                            </Button>
                            <Button type="button" outline color="primary"
                              aria-selected={this.state.navPills === 2}
                              className={classnames({
                                active: this.state.navPills === 2
                              })}
                              onClick={e => this.toggleNavs(e, "navPills", 2)}
                            >
                              {i18next.t("MEDIUM")}
                            </Button>
                            <Button type="button" outline color="primary"
                              aria-selected={this.state.navPills === 3}
                              className={classnames({
                                active: this.state.navPills === 3
                              })}
                              onClick={e => this.toggleNavs(e, "navPills", 3)}
                            >
                              {i18next.t("LARGE")}
                            </Button>
                            <Button type="button" outline color="primary"
                              aria-selected={this.state.navPills === 4}
                              className={classnames({
                                active: this.state.navPills === 4
                              })}
                              onClick={e => this.toggleNavs(e, "navPills", 4)}
                            >
                              {i18next.t("FAMILY")}
                            </Button>
                          </ButtonGroup>
                          </div>
                          </Col>
                        </Row>
                        }
                      </div>
                      <div className="quantity-area">
                          <div className="form-group">
                              <br/>
                              <label className="form-control-label" for="quantity">{i18next.t("Quantity")}</label>
                              <input type="number" name="quantity" 
                                id="quantity" className="form-control form-control-alternative" 
                                placeholder="1" required autoFocus
                                value={this.state.Password} min="1" max="10"
                                onChange={(e) => this.handleChange(e)}/>
                          </div>
                          <div class="quantity-btn">
                              <div id="addToCart1"><button class="btn btn-primary">{i18next.t("ADD TO CART")}</button></div>
                          </div>
                      </div>
                    </form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        </Modal>
        </Col>
      </Row>  
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuItem);
