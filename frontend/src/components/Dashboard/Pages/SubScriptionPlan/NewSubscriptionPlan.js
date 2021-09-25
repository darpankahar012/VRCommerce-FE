import React from "react";

import axios from "axios";

// react plugin used to create google maps

import Loader from "../../../common/Loader";

import NewSubScription from "../SubScriptionPlan/NewSubscriptionPlan";
import i18next from "i18next";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
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
  InputGroup,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { Dropdown } from "semantic-ui-react";

import AdminFooter from "../../../Footers/AdminFooter.js";
import Sidebar from "../../../Sidebar/Sidebar.js";

import routes from "../../../../routes";

//Navbar
import Navbar from "../../../Navbars/AdminNavbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import ReactDatetime from "react-datetime";

// for Redux
import { bindActionCreators } from "redux";
import { ActCreators } from "../../../../redux/bindActionCreator";
import { connect } from "react-redux";

// for api integration
import instance from "../../../../axios";
import requests from "../../../../requests";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import Moment from "react-moment";

let token = null;


const mapStateToProps = (state) => {
  token = state.token;

};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

export class NewSubscriptionPlan extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        title:"",
        content:"",
        country:"",
        currency:"",
        unit_amount:"",
        interval:"",
        is_active:"",
        intervalOB:[
          { value: "day", key: "Day", text: "Day" },
          { value: "week", key:"Week", text:"Week" },
          { value: "month", key:"Month", text:"Month "},
          { value: "year", key:"Year", text:"Year" }
        ],
        intervalCount:"",
        currencies:[],
        countries:[],
        country_code:'',

  
      };
    }
  
    getOrsetCountries = () => {
        axios.get("https://restcountries.eu/rest/v2/?fields=name;")
        .then((response) => {
          console.log("Response Data=>",response)
          let country = response.data
          let countries = []
          country.map((item,i) => {
    
            let countryOB = {
              value: item.name,
              key: item.name,
              text: item.name,
            };
            countries.push(countryOB)
            
          })
          this.setState({
            countries:countries
          }, () => {
            console.log("Countries State => ",this.state.countries);
          })
        })
        this.setState({
          Loader:false
        })
    }
   
  
    componentDidMount = async () => {
        this.getOrsetCountries();
    }
  
    handleSelectChange = (e, data) => {
      this.setState({
        [data.name]: data.value,
      });
      console.log("Value Og Select Box=>",data.value," Name = ",data.name)
    };

    handleSelectChangeForCountry = (e, data) => {
      this.setState({
        [data.name]: data.value,
      }, () => {
        axios.get(`https://restcountries.eu/rest/v2/name/${this.state.country.toLowerCase()}?fullText=true&fields=name;currencies;alpha2Code;`)
        .then((response) => {
          console.log("Response Data=>",response)
          let currency = response.data[0].currencies
          let currencies = []
          currency.map((item,i) => {
            let currencyOB = {
              value: item,
              key: item.code,
              text: `${item.code} ( ${item.name}  ${item.symbol} )`,
            };
            currencies.push(currencyOB)
          })
          this.setState({
            currencies:currencies,
            country_code: response.data[0].alpha2Code
          })
        })
      });
    };

    handleChange = (e) => {
      this.setState(
        {
          [e.target.name]: e.target.value,
        });
    };

    redirectToList = () => {
      const { history } = this.props;
      if (history) history.push("/subscriptionPlan");
    }
  
    AddNewPlan = async () => {
      const apiBody = {
        title: this.state.title,
        content: this.state.content,
        country: this.state.country,
        country_code:this.state.country_code.toLowerCase(),
        currency: this.state.currency.code.toLowerCase(),
        currency_symbol: this.state.currency.symbol,
        unit_amount: this.state.unit_amount,
        interval: this.state.interval,
        interval_count: this.state.intervalCount,
        is_active: "true"
      };
      console.log("",apiBody)
      const response = await instance
        .post(requests.fetchAddNewPlan, apiBody, {
          headers: {
            // Authorization: `Bearer ${token}`,
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYTBmN2NhMDI1YTZkNWI5YTliMjQ1MiIsImVtYWlsIjoiYWRtaW5AeW9wbWFpbC5jb20iLCJ1c2VyVHlwZSI6ImFkbWluIiwiaWF0IjoxNjA5MTU3Mjk2fQ.Smj9B5wXY4zQvaYYysaZfvCyPvBQezm8iru-Xr36RuA`,
          },
        })
        .catch((error) => {
           //let errorMessage = response.error.message;
           console.log("Error Res =>",response);
           console.log("Error => ",error);

           //NotificationManager.error(errorMessage);
        });
      if (response && response.data) {
        console.log("Response ==> ",response)
        
      }
    };
  
    render() {
      const {countries} = this.state
      return (
        <>
          <Sidebar
            {...this.props}
            routes={routes}
            logo={{
                innerLink: "/admin/index",
                imgSrc: require("assets/img/brand/argon-react.png"),
                imgAlt: "...",
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
              backgroundPosition: "center top",
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
                            <h1 className="mb-0">{i18next.t("Add New Subscription Plan")}</h1>
                        </div>
                        <div className="md-5">
                            <Row>
                            <Col>
                                <Button
                                color="primary"
                                size="sm"
                                type="button"
                                onClick={this.redirectToList}
                                >
                                {i18next.t("Back to List")}
                                </Button>
                            </Col>
                            </Row>
                        </div>
                    </div>
                  
                  </CardHeader>
                  <CardBody>
                    <Form>
                        <h6 className="heading-small text-muted mb-4"></h6>
                        <div className="pl-lg-4">
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="Name">{i18next.t("Title")}</Label>
                                    <Input
                                        className="px-2 py-4"
                                        type="text"
                                        placeholder={i18next.t("Title")}
                                        name="title"
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="Content">{i18next.t("Content")}</Label>
                                    <Input
                                        className="px-2 py-4"
                                        type="text"
                                        placeholder={i18next.t("Content")}
                                        name="content"
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="country">{i18next.t("Country Name")}</Label>
                                    <Dropdown
                                        placeholder={i18next.t("Select Country")}
                                        fluid
                                        search
                                        selection
                                        clearable
                                        name="country"
                                        options={countries}
                                        onChange={this.handleSelectChangeForCountry}
                                        // name="client"
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="Currency Code">{i18next.t("Currency Code")}</Label>
                                    {/* <Input
                                    className="px-2 py-4"
                                    type="text"
                                    placeholder="Currency Code"
                                    name="currency"
                                    onChange={this.handleChange}
                                    /> */}
                                    <Dropdown
                                        placeholder={i18next.t("Currency Code")}
                                        fluid
                                        search
                                        selection
                                        clearable
                                        name="currency"
                                        options={this.state.currencies}
                                        onChange={this.handleSelectChange}
                                        // name="client"
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="unit_amount">{i18next.t("Unit Amount")}</Label>
                                    <Input
                                        className="px-2 py-4"
                                        type="text"
                                        placeholder="Unit Amount"
                                        name="unit_amount"
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="interval">{i18next.t("Interval")}</Label>
                                    <Dropdown
                                        placeholder="Select Interval"
                                        fluid
                                        search
                                        selection
                                        clearable
                                        name="interval"
                                        options={this.state.intervalOB}
                                        onChange={this.handleSelectChange}
                                        // name="client"
                                    />
                                </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                <FormGroup>
                                    <Label for="Interval Count">{i18next.t("Interval Count")}</Label>
                                    <Input
                                        className="px-2 py-4"
                                        type="number"
                                        placeholder="Interval Count (Plan Periodically Interval)"
                                        name="intervalCount"
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>
                                </Col>
                            </Row>

                        </div>
                      <center>
                      <div className="text-center my-">
                        <Button
                            className="my-3 p-3"
                            color="primary"
                            type="button"
                            onClick={this.AddNewPlan}
                            >
                            {i18next.t('save')}
                        </Button>
                    </div>
                      </center>
                    </Form>
                  </CardBody>

                </Card>
              </Col>
            </Row> 
            <NotificationContainer />
          </Container>

          <Container fluid>
            <AdminFooter />
          </Container> 
        </div>
            
        </>
      );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSubscriptionPlan);
