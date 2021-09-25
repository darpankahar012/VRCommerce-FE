import React, { useState, useEffect } from "react";
import { Pannellum, PannellumVideo } from "pannellum-react";
// import myImage from "../../assets/img/angra.jpg";
import { Card, CardHeader, Container, Row } from "reactstrap";

export default function Test(props) {
  const panImage = React.useRef(null);

  return (
    <>
      {props.imgUrl ? (
        <>
          <Card className="shadow panoMainDiv">
            {props.cordinates.length ? (
              <Pannellum
                ref={panImage}
                width="100%"
                height="600px"
                image={props.imgUrl}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                onMouseup={(event) => {
                  props.setCordinates(
                    panImage.current.getViewer().mouseEventToCoords(event)
                  );
                }}
              >
                {props.cordinates.map((cordinate, index) => (
                  <Pannellum.Hotspot
                    type="info"
                    pitch={cordinate.pitch}
                    yaw={cordinate.yaw}
                    text={"Hotspot Text" + (index + 1)}
                    URL="https://www.google.com/search?q=360+images&sxsrf=ALeKk03_6lsK-2biMCeEggTzpbMnMkX5Zg:1609854715913&tbm=isch&source=iu&ictx=1&fir=49eoVreW85kOjM%252CZDuE7VZo_NlLZM%252C_&vet=1&usg=AI4_-kQ20zTxD4AS8jGnwTeQu-taHgcL1g&sa=X&ved=2ahUKEwiDiO2T-ITuAhXsyDgGHbMiBmUQ9QF6BAgOEAE#imgrc=49eoVreW85kOjM"
                  />
                ))}
              </Pannellum>
            ) : (
              <Pannellum
                ref={panImage}
                width="100%"
                height="600px"
                image={props.imgUrl}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                onMouseup={(event) => {
                  props.setCordinates(
                    panImage.current.getViewer().mouseEventToCoords(event)
                  );
                }}
              />
            )}
          </Card>
        </>
      ) : (
        "please uploed imgae"
      )}
    </>
  );
}
