import React, { Component } from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

export class HeaderOwner extends Component {
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
                {this.props.states.map((state) => {
                  return (
                    <>
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
                    </>
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

export default HeaderOwner;
