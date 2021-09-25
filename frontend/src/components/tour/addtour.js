import React, { useState, useEffect } from "react";
// import "./addTour.scss";
import Draggable from "react-draggable";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

// import Header from "../../../Headers/Header";
// import Header from "../../../src/components/Headers/Header";
// import TourPreview from "../TourPreview/tourPreview";
import Test from "../../components/tour/test";

let isHostpot = false;
export default function AddTour() {
  const [state, setState] = useState({
    files: [],
    imagePreviewUrl: [],
    oneImage: null,
    hostpotCordinates: [],
  });

  const [hostpot, setHostpot] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [isFile, setFile] = useState(null);
  const [displayPreview, setDisplayPreview] = useState(false);

  const handleStart = () => {
    console.log("handleStart");
  };
  const handleDrag = () => {
    console.log("handleDrag");
  };
  const handleStop = (e) => {};

  const _handleImageChange = (event) => {
    const mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = 'Only images are supported.';
      // return;
    }
    if (event.length > 0) {
      if (event) {
        const filesDetail = { ...state };
        for (let i = 0; i < event.length; i++) {
          const file = event[i];
          filesDetail.files.push(file);
          fileToCanvas(file);
        }
        Promise.all(
          Object.values(event).map((filea, index) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.addEventListener("load", (ev) => {
                resolve(ev.target.result);
                filesDetail.oneImage = ev.target.result;
              });
              reader.addEventListener("error", reject);
              reader.readAsDataURL(filea);
            });
          })
        ).then(
          (images) => {
            setState(filesDetail);
          },
          (error) => {
            console.error(error);
          }
        );
      }
      const uploadData = new FormData();
      for (let i = 0; i < state.files.length; i++) {
        uploadData.append("gallery", state.files[i]);
      }
    }
  };

  const fileToCanvas = (file) => {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var img = document.createElement("img");
    img.onload = function () {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      //   done(null, canvas);
    };
    img.onerror = function (err) {
      //   done(err);
    };
    img.src = URL.createObjectURL(file);
    setImgUrl(img.src);
    setFile(file);
    const filesDetail = { ...state };

    filesDetail.imagePreviewUrl.push(img.src);
    filesDetail.oneImage = img.src;
    setState(filesDetail);
  };

  const changeImage = (e, imgUrl) => {
    const filesDetail = { ...state };
    filesDetail.oneImage = imgUrl;
    setState(filesDetail);
  };

  let $imagePreview = null;
  if (state.imagePreviewUrl.length) {
    $imagePreview = state.imagePreviewUrl.map((imgUrl, index) => {
      return (
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3" key={index}>
          <div className="imageGrid" onClick={(e) => changeImage(e, imgUrl)}>
            <img src={imgUrl} className="image w-100" />
          </div>
        </div>
      );
    });
  }

  // useEffect(() => {
  //  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAa',hostpot)
  // },[hostpot]);

  const setHostpotPostion = () => {
    isHostpot = true;
    setHostpot(true);
  };
  const setPreview = () => {
    setDisplayPreview(true);
  };
  const handleCordinates = (cordinates) => {
    if (isHostpot) {
      const newState = { ...state };
      const hCordinates = {
        yaw: cordinates[1],
        pitch: cordinates[0],
      };
      newState.hostpotCordinates.push(hCordinates);
      isHostpot = false;
      setHostpot(false);
      setState(newState);
    }
  };

  return (
    <div className="addTourDiv">
      {/* <Header /> */}
      <Container className="mt-5 addTourMainDiv" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Add Tour</h3>
              </CardHeader>
              {displayPreview ? (
                // <TourPreview imgUrl={imgUrl} />
                <Test
                  imgUrl={state.oneImage}
                  setCordinates={handleCordinates}
                  cordinates={state.hostpotCordinates}
                />
              ) : (
                <div className="container addTourMainDiv">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="file btn btn-primary w-100 mt-2">
                        Upload Image
                        <input
                          //   name="file"
                          type="file"
                          multiple
                          onChange={(event) =>
                            _handleImageChange(event.target.files)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      {state.oneImage ? (
                        <button
                          type="button"
                          className="btn btn-primary w-100 mt-2"
                          onClick={setHostpotPostion}
                        >
                          Add Hostpot
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
                      {state.oneImage ? (
                        <button
                          type="button"
                          className="btn btn-primary w-100 mt-2"
                          onClick={setPreview}
                        >
                          Preview
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div>
                        {state.oneImage ? (
                          <>
                            {/* <TourPreview imgUrl={state.oneImage} /> */}
                            <Test
                              imgUrl={state.oneImage}
                              setCordinates={handleCordinates}
                              cordinates={state.hostpotCordinates}
                            />
                          </>
                        ) : (
                          "Image Not Selected"
                        )}
                      </div>
                      {hostpot ? (
                        <div id="newHotspot" className="location">
                          <Draggable
                            handle=".handle"
                            onStart={handleStart}
                            onDrag={handleDrag}
                            onStop={handleStop}
                          >
                            <div>
                              <div className="handle">
                                <i className="ni ni-settings-gear-65" />
                              </div>
                            </div>
                          </Draggable>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  {state.imagePreviewUrl.length ? (
                    <div className="row mt-5 mb-5">{$imagePreview}</div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </Card>
          </div>
        </Row>
      </Container>
    </div>
  );
}
