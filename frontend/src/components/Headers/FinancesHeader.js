import React from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

// For Redux Data 
import {bindActionCreators} from "redux";
import {ActCreators} from "../../redux/bindActionCreator";
import {connect} from "react-redux";
import i18next from "i18next";

let SetFinanceDetail = {}

const mapStateToProps = state => {
  SetFinanceDetail=state.SetFinanceDetail
};
const mapDispatchToProps = dispatch => {
return bindActionCreators(ActCreators, dispatch)
};
class FinacesHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data:[]      
    }
  }
  render() {
    return (
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            {i18next.t("ORDERS")} 
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {
                              (this.props.state) &&
                                this.props.state.orders
                            } 
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i className="fas fa-chart-bar" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            {i18next.t("TOTAL")}
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                              {
                                (this.props.state) &&
                                  this.props.state.total
                              }
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i className="fas fa-chart-pie" />
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="4">
                    <Card className="card-stats mb-4 mb-xl-0">
                      <CardBody>
                        <Row>
                          <div className="col">
                            <CardTitle
                              tag="h5"
                              className="text-uppercase text-muted mb-0"
                            >
                              {i18next.t("NET")}
                            </CardTitle>
                            <span className="h2 font-weight-bold mb-0">
                              { 
                                (this.props.state) &&
                                this.props.state.net_value
                              }
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                              <i className="fas fa-percent" />
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>  
              </Row>
             </div>
          </Container>
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (FinacesHeader);
