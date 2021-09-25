
import React from "react";
import i18next from "i18next";
import Switch from "react-switch";
// react plugin used to create google maps
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
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle
} from "reactstrap";

// font Awesome

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// For Redux Data
import {bindActionCreators} from "redux";
import {ActCreators} from "../../../../redux/bindActionCreator";
import {connect} from "react-redux";

// Server Port Instance
import instance from "../../../../axios"
import requests from "../../../../requests";

// Notification 
import {NotificationContainer, NotificationManager} from 'react-notifications';

// Alert
import { Alert } from 'reactstrap';
import { Link } from "react-router-dom";

let token=null

const mapStateToProps = state => {
    token=state.token
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(ActCreators, dispatch)
};


class PageList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       datas:[],
    }
  }
  componentDidMount = async () => {
    // Get All Page API Integration
    let bodyAPI = {
      "page_id":"",
      "show_as_link":""
    }
    const response = await instance.post(requests.fetchGetAllPages,bodyAPI,{
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
  onCallDelete = async (id) => {
    const response = await instance.delete(requests.fetchDeletePage+`/${id}`,{
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

redirectOnCreatePage = () => {
    const {history} = this.props;
    if (history) history.push('/pages/create')
};

handleChange = async (e,index) => {
  const name = e.target.name;
  const value = e.target.checked;
  let dataNew = this.state.datas
 
  dataNew[index].show_as_link=value
   this.setState ({
    datas:dataNew
  })
  let bodyAPI = {
    "page_id":this.state.datas[index]._id,
    "show_as_link":this.state.datas[index].show_as_link
  }
  const response = await instance.post(requests.fetchGetAllPages,bodyAPI,{
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
redirectEditPage = (item,index) => {
  this.props.SET_PAGE_ID(item._id)
  const {history} = this.props;
  if (history) history.push(`/pages/edit/${index}`)
}
  render() {
    return (
      <>
        {/* header */}
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <br/><br/>
            </div>
          </Container>
        </div>

        <Container className="mt--7" fluid>    
          <Row>
            <div className="col">              
              <Card className="shadow">
                <CardHeader className="border-0">
                <div className="d-flex justify-content-between">
                    <div className="md-7">
                      <h1 className="mb-0">{i18next.t("Pages")}</h1>  
                    </div>
                    <div className="md-5">
                        <Row>
                            <Col>
                                <Button color="primary" size="sm" type="button"
                                  onClick={this.redirectOnCreatePage}>
                                    {i18next.t("Add Page")}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    
                  </div>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">TITLE</th>
                      <th scope="col">CONTENT</th>
                      <th scope="col">SHOW AS LINK</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                   {
                     this.state.datas.map((item,index) => 
                     <tr>
                      <td>
                        {item.title}                    
                      </td>
                      <td>
                        <span style={{cursor:"pointer"}} 
                          onClick={() => this.redirectEditPage(item,index+1)}>
                          {i18next.t("Click for Details")}
                        </span>
                      </td>    
                      <td>
                        {/* <label class="custom-toggle">
                            <input type="checkbox" id={index} class="showAsLink" pageid="1" 
                              checked={this.state.datas[index].checked} value={this.state.datas[index].checked}
                              onChange={this.handleChange(index)} />
                            <span class="custom-toggle-slider rounded-circle" ></span>
                        </label> */}
                        <label className="custom-toggle">
                            {item.show_as_link === true ? (
                              <input
                                defaultChecked
                                type="checkbox"
                                name="show_as_link"
                                onChange={(e) => {this.handleChange(e,index)}}
                              />
                            ) : (
                              <input
                                type="checkbox"
                                name="show_as_link"
                                onChange={(e) => {this.handleChange(e,index)}}
                              />
                            )}
                            <span className="custom-toggle-slider rounded-circle" />
                          </label>

                        {/* <Switch onChange={this.handleChange(index)} checked={this.state.datas[index].checked} /> */}
                      </td>
                      <td>
                          <UncontrolledDropdown>
                           <Button
                             style={{ padding: 0, border: "none" }}
                             color="secondary"
                             outline
                             type="button"
                             className="text-muted"
                           >
                             <DropdownToggle
                               style={{ border: "none" }}
                               outline
                             >
                               <FontAwesomeIcon icon={faEllipsisV} />
                             </DropdownToggle>
                           </Button>
                           <DropdownMenu right>
                             <DropdownItem onClick={ () => this.onCallDelete (item._id) }>{i18next.t("Delete")}</DropdownItem>
                           </DropdownMenu>
                         </UncontrolledDropdown>
                      </td>
                      
                    </tr>
                  )}  
                  </tbody>
                </Table> 
               
              </Card>
            </div>
          </Row>
          <NotificationContainer />
        </Container>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (PageList);
