import React, { Component } from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";

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
              <Row>
                {this.props.states.map((state, index) => {
                  return (
                    <Col xs={12} sm="6 mb-4" xl={4}>
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
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
      </>
    );
  }
}

export default HeaderOwner;
