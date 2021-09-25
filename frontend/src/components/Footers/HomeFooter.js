import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";


// Server Port Instance
import instance from "../../axios"
import requests from "../../requests";

// Notification 
import {NotificationContainer, NotificationManager} from 'react-notifications';

import  { Link, Redirect } from 'react-router-dom'

// For Redux Data
import {bindActionCreators} from "redux";
import {ActCreators} from "../../redux/bindActionCreator";
import {connect} from "react-redux";

let token=null

const mapStateToProps = state => {
    token=state.token
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActCreators, dispatch)
};

class HomeFooter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       datas:[],
       index:null,
       flag:false
    }
  }
  componentDidMount = async () => {
    // Get All Page API Integration
    // const response = await instance.get(requests.fetchGetAllPagesForClient).catch((error) => {
    //     let errorMessage = error.response.data.error.message;
    //     NotificationManager.error(errorMessage)
    // });
    // if(response && response.data){
    //     this.setState({
    //         datas:response.data.data.pages
    //     })
    // }
  }
  redirectTOPage = (e,i,id) => {
    this.props.SET_PAGE_ID(id)
    this.setState({
      index:i,
      flag:true
    })    
  }

  render() {
    const {index} = this.state;
    
    if(this.state.flag){
      return <Redirect to={"/pages/"+index} target="_blank" />
    }
    return (
      <>
        <footer className="py-5" style={{backgroundColor:"#f8f9fe"}}>
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-center text-xl-left text-muted">
                  <Link to="/">
                  <h4 style={{cursor:"pointer",color:`#696969`}}>
                    © 2020{" "}                  
                    vrcommerce
                    </h4>
                  </Link>
                </div>
              </Col>
              <Col xl="6">
                <Nav className="nav-footer justify-content-center justify-content-xl-end">
                  {
                      this.state.datas.map((item,i) => {
                        if(item.show_as_link === true ){
                          return(
                            <NavItem>
                              <NavLink 
                                onClick={(e) => this.redirectTOPage(e,i+1,item._id)} >
                                <h4 style={{cursor:"pointer",color:`#696969`}}> {item.title} </h4>
                              </NavLink>
                            </NavItem>        
                          )
                        }
                      })
                  }
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (HomeFooter);
