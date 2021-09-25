
import React from "react";
import { NavLink as NavLinkRRD, Link, Redirect } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import NavBar from "../Navbars/AdminNavbar";
import i18next from "i18next";

// icons
import { Icon } from 'semantic-ui-react'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator"; //../../../redux/bindActionCreator
import { connect } from "react-redux";

import instance from "../../axios";
import requests from "../../requests";

// for notification
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

let userData = {};
let token = null;
let get_fcm_registration_token = null;
const mapStateToProps = (state) => {
  userData = state.userData;
  get_fcm_registration_token = state.get_fcm_registration_token;
  token = state.token;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class Sidebar extends React.Component {
  state = {
    collapseOpen: false,
    redirect: false,
    allLanguages: [
      { value: "en", key: "en", text: "English" },
      { value: "hi", key: "hi", text: "Hindi" },
    ],
    imageSrc: userData.hasOwnProperty("profile_image") ? userData.profile_image.image_url : process.env.REACT_APP_DEFAULT_IMAGE,
    userName: userData.hasOwnProperty("name") ? userData.name : "",
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
  }

  onLogout = async () => {
    if (this.state.isSafari === true) {
      const { history } = this.props;
      this.props.DESTOROY_SESSION();
      NotificationManager.success("Logout Successfully");
      setTimeout(() => {
        this.setState({ redirect: true });
        //  history.push('/');
      }, 2000);
    } else {
      if (get_fcm_registration_token === null) {
        const { history } = this.props;
        this.props.DESTOROY_SESSION();
        NotificationManager.success("Logout Successfully");
        setTimeout(() => {
          this.setState({ redirect: true });
          //  history.push('/');
        }, 2000);
      } else {
        const data = {
          fcm_regi_token: true,
          fcm_registration_token: get_fcm_registration_token,
        };
        const response = await instance
          .post(requests.fetchLogout, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .catch((error) => {
            const errorMessage = error.response.data.error.message;
            NotificationManager.error(errorMessage);
            console.log(errorMessage);
          });
        if (response && response.data) {
          const { history } = this.props;
          this.props.DESTOROY_SESSION();
          NotificationManager.success("Logout Successfully");
          this.props.GET_FCM_REGISTRATION_TOKEN(null);
          setTimeout(() => {
            this.setState({ redirect: true });
            //  history.push('/');
          }, 2000);
        }
      }
    }
  };

  // onLogout = async () => {
  //   if (this.state.isSafari === true) {
  //     const { history } = this.props;
  //     this.props.DESTOROY_SESSION();
  //     NotificationManager.success("Logout Successfully");
  //     setTimeout(() => {
  //       this.setState({ redirect: true });
  //       //  history.push('/');
  //     }, 2000);
  //   } else {
  //     const data = {
  //       fcm_regi_token: true,
  //       fcm_registration_token: get_fcm_registration_token,
  //     };
  //     const response = await instance
  //       .post(requests.fetchLogout, data, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .catch((error) => {
  //         const errorMessage = error.response.data.error.message;
  //         NotificationManager.error(errorMessage);
  //         console.log(errorMessage);
  //       });
  //     if (response && response.data) {
  //       const { history } = this.props;
  //       this.props.DESTOROY_SESSION();
  //       NotificationManager.success("Logout Successfully");
  //       setTimeout(() => {
  //         this.setState({ redirect: true });
  //         //  history.push('/');
  //       }, 2000);
  //     }
  //   }
  // };

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.img) {
      this.setState({
        imageSrc: nextProps.img,
      });
    }
    if (nextProps.name) {
      this.setState({
        userName: nextProps.name,
      });
    }
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen,
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false,
    });
  };
  // creates the links that appear in the left menu / Sidebar
  createLinks = (routes) => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.path}
            tag={NavLinkRRD}
            onClick={this.closeCollapse}
            activeClassName="active"
          >
            {/* <Icon name={prop.icon} size='large' /> */}
            <i className={prop.icon} />

            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  redirectToLogin = () => {
    const { history } = this.props;
    if (history) history.push("/");
  };

  componentDidMount = () => {
    var isSafari =
      navigator.vendor &&
      navigator.vendor.indexOf("Apple") > -1 &&
      navigator.userAgent &&
      navigator.userAgent.indexOf("CriOS") == -1 &&
      navigator.userAgent.indexOf("FxiOS") == -1;
    this.setState({ isSafari: isSafari });
  };

  handleSelectChange = (e) => {
    localStorage.setItem("lang", e.target.value);
    window.location.reload();
    this.setState({ [e.target.name]: e.target.value }, () => {
      console.log(this.state);
    });
  };

  render() {
    const lang = localStorage.getItem("lang") || "en";
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    const { bgColor, routes, logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link,
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank",
      };
    }
    return (
      <>
        <Navbar
          className="navbar-vertical fixed-left navbar-light bg-white"
          expand="md"
          id="sidenav-main"
        >
          <Container fluid>
            {/* Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-icon" />
            </button>
            {/* Brand */}
            {logo ? (
              <NavbarBrand className="pt-0" {...navbarBrandProps}>
                {" "}
                <h2>vrcommerce</h2>
              </NavbarBrand>
            ) : null}
            {/* User */}
            <Nav className="align-items-center d-md-none">
              {/* <UncontrolledDropdown nav>
              <DropdownToggle nav className="nav-link-icon">
                <i className="ni ni-bell-55" />
              </DropdownToggle>
              <DropdownMenu
                aria-labelledby="navbar-default_dropdown_1"
                className="dropdown-menu-arrow"
                right
              >
                <DropdownItem>Action</DropdownItem>
                <DropdownItem>Another action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Something else here</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
              <UncontrolledDropdown nav>
                <DropdownToggle nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img alt="..." src={this.state.imageSrc} />
                    </span>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">{i18next.t("Welcome!")}</h6>
                  </DropdownItem>
                  <DropdownItem to="/profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>{i18next.t("My profile")}</span>
                  </DropdownItem>
                  {/* <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem> */}
                  <DropdownItem divider />
                  <div
                    className="my-3"
                    style={{ paddingRight: "11px", paddingLeft: "11px" }}
                  >
                    <span>
                      <select
                        name="transl"
                        onChange={this.handleSelectChange}
                        value={lang}
                        style={{
                          // padding: "0.671rem",
                          // borderRadius: "0.38rem",
                          width: "100%",
                          border: "none",
                          // fontSize: "0.875rem",
                        }}
                      >
                        {this.state.allLanguages.map((lange) => {
                          return (
                            <>
                              <option value={lange.value}>{lange.text}</option>
                            </>
                          );
                        })}
                      </select>
                    </span>
                  </div>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => this.onLogout()}>
                    <i className="ni ni-user-run" />
                    <span>{i18next.t("Logout")}</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {/* Collapse */}
            <Collapse navbar isOpen={this.state.collapseOpen}>
              {/* Collapse header */}
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  {logo ? (
                    <Col className="collapse-brand" xs="6">
                      {/* {logo.innerLink ? (
                        <Link to={logo.innerLink}>
                          <img alt={logo.imgAlt} src={logo.imgSrc} />
                        </Link>
                      ) : (
                        <a href={logo.outterLink}>
                          <img alt={logo.imgAlt} src={logo.imgSrc} />
                        </a>
                      )} */}
                       <h2>vrcommerce</h2>
                    </Col>
                  ) : null}
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      type="button"
                      onClick={this.toggleCollapse}
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              {/* Form */}
              <Form className="mt-4 mb-3 d-md-none">
                {/* <InputGroup className="input-group-rounded input-group-merge">
                  <Input
                    aria-label="Search"
                    className="form-control-rounded form-control-prepended"
                    placeholder="Search"
                    type="search"
                  />
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <span className="fa fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup> */}
              </Form>
              {/* Navigation */}
              <Nav navbar>{this.createLinks(routes)}</Nav>
              {/* Divider */}
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
