
import React from "react";

import i18next from "i18next";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
// reactstrap components

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
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup
  } from "reactstrap";
import ReactDatetime from "react-datetime";

//Navbar
import Navbar from "../../../Navbars/AdminNavbar";

// core components
import Header from "components/Headers/Header.js";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
// core components
import AdminNavbar from "../../../Navbars/AdminNavbar.js";
import AdminFooter from "../../../Footers/AdminFooter.js";
import Sidebar from "../../../Sidebar/Sidebar.js";

import routes from "../../../../routes.js";

// CKEditor
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// For Redux Data
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../../redux/bindActionCreator";
import {connect} from "react-redux";

// Server Port Instance
import instance from "../../../../axios"
import requests from "../../../../requests";

// Notification 
import {NotificationContainer, NotificationManager} from 'react-notifications';

let token=null
let Page_Id=null

const mapStateToProps = state => {
    token=state.token
    Page_Id=state.Page_Id
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActCreators, dispatch)
};
class PageEdit extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {

       datas:[]
    }
  }

  onCallUpdate = async () => {
    let bodyAPI = {
      "page_id":Page_Id,
      "title":this.state.title,
      "content":this.state.content 
    }
    const response = await instance.patch(requests.fetchUpdatePage,bodyAPI,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    }).catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage)
    });
    if(response && response.data){
      NotificationManager.success('Successfully Update Page..!');
      const {history} = this.props;
      if (history) history.push('/pages')
    } 
  }
  componentDidMount = async () => {
    // Get All Page API Integration
    let bodyAPI = {
      "page_id":Page_Id,
    }
    const response = await instance.post(requests.fetchGetPageDetails,bodyAPI,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    }).catch((error) => {
        let errorMessage = error.response.data.error.message;
        NotificationManager.error(errorMessage)
    });
    if(response && response.data){
        this.setState({
          datas:response.data.data.pages
        })
    }
  }
  handleChange (e) {
    this.setState({
        [e.target.name]: e.target.value
    })
  };
  redirectToList = () =>{
    const {history} = this.props;
    if (history) history.push('/pages')
  }
  handleFileChange = (e) => {
    //alert("Call File change");
    this.toBase64(e.target.files[0]).then((data) => {      
      this.setState({ image: data});
    });
  };

  toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
    handleRemoveFile =(e) => {
      e.preventDefault();
      this.setState({ image: '' });
     }
  render() {
    const {image,coverImage} = this.state
    return (
      <>   
       <Sidebar
          {...this.props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("assets/img/brand/argon-react.png"),
            imgAlt: "..."
          }}
        />
        <div className="main-content" ref="mainContent">
        <Navbar />
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "300px",
            backgroundImage:
              "url(" + require("assets/img/theme/profile-cover.jpg") + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center">
            <Row>
              <Col lg="7" md="10">
                <h3 className="display-3 text-white"></h3>
              </Col>
            </Row>
          </Container>
        </div>
        <Container className="mt--7" fluid>
          <Row>
            <Col className="col">
              <Card className="bg-secondary shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("Page Management")}</h1>  
                    </div>
                    <div className="md-5">
                        <Row>
                            <Col>
                                <Button color="primary" size="sm" type="button"
                                  onClick= {this.redirectToList}>
                                    {i18next.t("Back to Pages")}
                                </Button>
                            </Col>
                        </Row>
                    </div>     
                  </div>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                        {i18next.t("PAGE INFORMATION")}
                    </h6>
                    <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="title"
                            >
                            {i18next.t("Title")}
                            </label>
                            <Input
                              className="form-control-alternative"
                              placeholder="Title here ..."
                              type="text" name="title"
                              value={this.state.datas.title}
                              onChange={(e) => this.handleChange(e)}                              
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                      <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              {i18next.t("Content")}
                            </label>
                            <CKEditor
                              editor={ ClassicEditor }
                              data={this.state.datas.content}
                              onInit={ editor => {
                              }}
                              onChange={ ( event, editor ) => {
                                  const data = editor.getData();
                              } }
                              onBlur={ ( event, editor ) => {
                                  console.log( 'Blur.', editor );
                              } }
                              onFocus={ ( event, editor ) => {
                                  console.log( 'Focus.', editor );
                              } }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <center>
                    <Button
                      className="my-4"
                      color="success"
                      type="button"
                      onClick={this.onCallUpdate}
                    >
                            {i18next.t("Update")}
                    </Button>
                    </center>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>  
        </Container>
            
        <Container fluid>
            <AdminFooter />
        </Container>
        </div>
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps) (PageEdit);