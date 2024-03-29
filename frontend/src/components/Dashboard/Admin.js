/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar.js";
import AdminFooter from "../../components/Footers/AdminFooter.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";

import adminRoutes from "../../routes.js";
import ownerRoutes from "../../ownerRoutes";
import driverRoutes from "../../driverRouts";
import { clientsRoutes } from "../../clientRouts";

import { bindActionCreators } from "redux";
import { ActCreators } from "../../redux/bindActionCreator";
import { connect } from "react-redux";

let userData = {};

const mapStateToProps = (state) => {
  userData = state.userData;
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(ActCreators, dispatch);
};

class Admin extends React.Component {
  componentDidUpdate(e) {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.mainContent.scrollTop = 0;
  }
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      return <Route path={prop.path} component={prop.component} key={key} />;
    });
  };
  getBrandText = (path, routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  render() {
    let routes = adminRoutes;
    if (userData.registerType === "admin") {
      routes = adminRoutes;
    } else if (userData.registerType === "user") {
      routes = ownerRoutes;
    } else if (userData.registerType === "driver") {
      routes = driverRoutes;
    } else {
      routes = clientsRoutes;
    }
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
          <AdminNavbar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname, routes)}
          />
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/index" />
          </Switch>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
