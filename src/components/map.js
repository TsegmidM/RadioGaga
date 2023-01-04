import { Button } from "antd";
import { useContext, useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
// import {GeolocateControl} from 'react-map-gl-geocoder';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import fmStation from "./geo.min.json";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoRadioOutline } from "react-icons/io5";
import { RadioStaionContext } from ".";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import { MAPBOXTOKEN } from "./MapBoxTOKEN";
export default function MyMap() {
  const { chosenRadio, viewPortHandler } = useContext(RadioStaionContext);
  const [viewport, setViewport] = useState({
    // latitude: chosenRadio.coordinates?.lat,
    // longitude: chosenRadio.coordinates?.long,
    // width: "100vw",
    // height: "100vh",
    // zoom: 9,
  });
  // const viewPortHandler = () => {
  //   axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${chosenRadio}.json?types=region&access_token=${MAPBOXTOKEN.KEY}`)
  //   .then((res)=>{
  //     console.log(res.data.features.filter((reg)=>reg.place_name===chosenRadio));
  //   })
  //   console.log(chosenRadio,"hi");
  // };
  useEffect(() => {
    setViewport({
      latitude: chosenRadio.coordinates?.lat,
      longitude: chosenRadio.coordinates?.long,
      width: "100vw",
      height: "100vh",
      zoom: 3,
    });
  }, [chosenRadio]);
  return (
    <div style={{ height: "100vh" }}>
      <ReactMapGL
        {...viewport}
        style={{ height: "100%" }}
        mapboxAccessToken={MAPBOXTOKEN.KEY}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        projection="globe"
      >
        <Marker
          offsetTop={(-viewport.zoom * 5) / 2}
          latitude={chosenRadio.coordinates?.lat}
          longitude={chosenRadio.coordinates?.long}
        ></Marker>
        {/* {fmStation.features.slice(0, 1000).map((fm, idx) => {
          // console.log(fm);
          return (
            <Marker
              key={idx}
              offsetTop={(-viewport.zoom * 5) / 2}
              latitude={fm.geometry.coordinates[1]}
              longitude={fm.geometry.coordinates[0]}
              //   width={viewport.zoom * 10}
              //   height={viewport.zoom * 10}
              //   onDrag
            >
              <IoRadioOutline
                color="green"
                style={{ width: "20px", height: "20px" }}
              />
            </Marker>
          );
        })} */}
      </ReactMapGL>
    </div>
  );
}
