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

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateCard: [],
    };
  }
  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                {this.props.states.map((state, index) => {
                  return (
                    <Col lg="6" xl="3">
                      <Card className="card-stats mb-4 mb-xl-0">
                        <CardBody>
                          <Row>
                            <div className="col">
                              <CardTitle
                                tag="h5"
                                className="text-uppercase text-muted mb-0"
                              >
                                {state.cardTitle}
                              </CardTitle>
                              <span className="h2 font-weight-bold mb-0">
                                {state.state_value}
                              </span>
                            </div>
                            <Col className="col-auto">
                              <div
                                className={`icon icon-shape ${state.color} text-white rounded-circle shadow`}
                              >
                                <i className={state.icon} />
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default Header;
