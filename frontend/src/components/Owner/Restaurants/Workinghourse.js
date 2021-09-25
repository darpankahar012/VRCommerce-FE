import React, { Component } from "react";

// reactstrap components
import {
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

import i18next from "i18next"
// Flatpicker for working hours
import flatpickr from "flatpickr";

import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

// restaurants css file
import "./Restaurantscss.css";

class Workinghourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dayName: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    };
  }

  handkeChange = (event) => {
    console.log("Event.target",event.target.checked);
    console.log("This.props.i",this.props.i);
    this.props.handleWorkingHours(
      event.target.checked,
      this.props.i,
      "isChecked"
    );
  };

  render() {
    const { data, i } = this.props;
    const { dayName } = this.state;
    //console.log("Prps Data => ",this.props.data)
    return (
      <>
        <Row className="mx-1">
          <Col md="4" sm="12">
            <div className="custom-control custom-checkbox mb-3">
              {/* <Input type="checkbox" name={time.dayName} />
              <label className="custom-control-label" htmlFor={time.dayName}>
                {time.dayName}
              </label> */}
              {data.isChecked === false ? (
                <input
                  className="custom-control-input"
                  id={`customeCheck${i}`}
                  type="checkbox"
                  name="isCheck"
                  onClick={(event) => {this.handkeChange(event)}}
                />
              ) : (
                <input
                  className="custom-control-input"
                  defaultChecked
                  id={`customeCheck${i}`}
                  type="checkbox"
                  name="isCheck"
                  onClick={(event) => {this.handkeChange(event)}}
                />
              )}

              <label
                className="custom-control-label"
                htmlFor={`customeCheck${i}`}
              >
                {i18next.t(dayName[i])}
              </label>
            </div>
          </Col>
          <Col sm="5 px-0" md="3" xs={12}>
            <InputGroup>
              <InputGroupAddon
                addonType="prepend"
                style={{ border: "1px solid #cad1d7" }}
                className="rounded"
              >
                <InputGroupText style={{ border: "none" }}>
                  <i className="ni ni-air-baloon"></i>
                </InputGroupText>
                <Flatpickr
                  data-enable-time
                  value={
                    this.props.data.isChecked === true
                      ? this.props.data.openingTime
                      : ""
                  }
                  placeholder={i18next.t("Time")}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    disableMobile: "true"
                  }}
                  className="w-75 p-3 text-muted rounded"
                  style={{ border: "none" }}
                  onChange={(date) => {
                    const newDate = new Date(date[0]);
                    const Hours =
                      newDate.getHours() < 10
                        ? `0${newDate.getHours()}`
                        : newDate.getHours();
                    const Minutes =
                      newDate.getMinutes() < 10
                        ? `0${newDate.getMinutes()}`
                        : newDate.getMinutes();
                    this.props.handleWorkingHours(
                      `${Hours}:${Minutes}`,
                      this.props.i,
                      "openingTime"
                    );
                  }}
                />
              </InputGroupAddon>
            </InputGroup>
          </Col>
          <Col sm="2" xs={12} className="text-center">
            <p className="display-4">-</p>
          </Col>
          <Col sm="5 px-0" md="3" xs={12}>
            <InputGroup>
              <InputGroupAddon
                addonType="prepend"
                style={{ border: "1px solid #cad1d7" }}
                className="rounded"
              >
                <InputGroupText style={{ border: "none" }}>
                  <i className="ni ni-air-baloon"></i>
                </InputGroupText>
                <Flatpickr
                  data-enable-time
                  value={
                    this.props.data.isChecked === true
                      ? this.props.data.closingTime
                      : ""
                  }
                  placeholder={i18next.t("Time")}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    disableMobile: "true"
                  }}
                  className="w-75 p-3 text-muted rounded"
                  style={{ border: "none" }}
                  onChange={(date) => {
                    const newDate = new Date(date[0]);
                    const Hours =
                      newDate.getHours() < 10
                        ? `0${newDate.getHours()}`
                        : newDate.getHours();
                    const Minutes =
                      newDate.getMinutes() < 10
                        ? `0${newDate.getMinutes()}`
                        : newDate.getMinutes();
                    this.props.handleWorkingHours(
                      `${Hours}:${Minutes}`,
                      this.props.i,
                      "closingTime"
                    );
                  }}
                />
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <br />
      </>
    );
  }
}

export default Workinghourse;
