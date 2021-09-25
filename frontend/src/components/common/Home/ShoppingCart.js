import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Row,Col ,Container} from 'reactstrap';
import i18next from "i18next";
import "components/common/Home/ShoppingCart.css"
export const ShoppingCart = (props) => {
    const {
      buttonLabel,
      className
    } = props;
  
    const [modal, setModal] = useState(false);
  
    const toggle = () => setModal(!modal);
    return (
        <div>
            <Button className='registerRestaurant__button' onClick={toggle}
                data-toggle="modal" data-target="#myModal2">
                <div>
                    <i class="ni ni-cart"></i>
                    <span>Cart</span>
                </div>
            </Button>
        <Row>
            <Col xs={12}>
            <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <div class="minicart-heading">
                    <h1>Shopping Cart</h1>
                </div></ModalHeader>
            <ModalBody>
                <Container>
                    <Row className="">
                        <Col sm={12} md={4} lg={4} xs={12}>
                            <div class="justify-content-right">
                                <img src="https://foodtiger.mobidonia.com/uploads/restorants/93641a19-dba6-4010-a852-0e88da83a01f_thumbnail.jpg" width="100" height="105" alt="" class="productImage" />
                            </div>
                        </Col>
                        <Col sm={12} md={8} lg={8} xs={12}>
                            <h5>Salad Napoli (350g) + Tuna + olive</h5 >
                            <p class="product-item_quantity">1 x $11.49</p>
                            <ul class="pagination">
                                <li class="page-item">
                                    <button value="1601886913" tabindex="-1" class="page-link">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm={12} md={4} lg={4} xs={12}>
                            <div class="justify-content-right">
                                <img src="https://foodtiger.mobidonia.com/uploads/restorants/93641a19-dba6-4010-a852-0e88da83a01f_thumbnail.jpg" width="100" height="105" alt="" class="productImage" />
                            </div>
                        </Col>
                        <Col sm={12} md={8} lg={8} xs={12}>
                            <h5>Salad Napoli (350g) + Tuna + olive</h5 >
                            <p class="product-item_quantity">1 x $11.49</p>
                            <ul class="pagination">
                                <li class="page-item">
                                    <button value="1601886913" tabindex="-1" class="page-link">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm={12} md={4} lg={4} xs={12}>
                            <div class="justify-content-right">
                                <img src="https://foodtiger.mobidonia.com/uploads/restorants/93641a19-dba6-4010-a852-0e88da83a01f_thumbnail.jpg" width="100" height="105" alt="" class="productImage" />
                            </div>
                        </Col>
                        <Col sm={12} md={8} lg={8} xs={12}>
                            <h5>Salad Napoli (350g) + Tuna + olive</h5 >
                            <p class="product-item_quantity">1 x $11.49</p>
                            <ul class="pagination">
                                <li class="page-item">
                                    <button value="1601886913" tabindex="-1" class="page-link">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <Row className="">
                        <Col sm={12} md={4} lg={4} xs={12}>
                            <div class="justify-content-right">
                                <img src="https://foodtiger.mobidonia.com/uploads/restorants/93641a19-dba6-4010-a852-0e88da83a01f_thumbnail.jpg" width="100" height="105" alt="" class="productImage" />
                            </div>
                        </Col>
                        <Col sm={12} md={8} lg={8} xs={12}>
                            <h5>Salad Napoli (350g) + Tuna + olive</h5 >
                            <p class="product-item_quantity">1 x $11.49</p>
                            <ul class="pagination">
                                <li class="page-item">
                                    <button value="1601886913" tabindex="-1" class="page-link">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </li> 
                                <li class="page-item">
                                    <button value="1601886913" class="page-link">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <br/>
                    <div id="totalPrices"  className="text-center">
                        <Row className="text-center">
                            <Col sm={12} md={12} lg={12} xs={12}>
                                <span><strong> Subtotal: </strong></span> 
                                <span><strong> $ 11.49</strong></span>
                            </Col><br/><br/>
                            <Col sm={12} md={12} lg={12} xs={12}>
                                <div>
                                    <Button block color="primary" size="lg" type="button">
                                        Checkout
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                
                </Container>                    
            </ModalBody>
            
            </Modal>
            </Col>
        </Row>
      </div>
    )
}
export default ShoppingCart
