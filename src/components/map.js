import { Button } from "antd";
import { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import fmStation from "./geo.min.json";
import 'mapbox-gl/dist/mapbox-gl.css';
import { IoRadioOutline } from "react-icons/io5";
export default function MyMap() {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100vw",
    height: "100vh",
    zoom: 9,
  });
  return (
    <div style={{ height: "100vh" }}>
      <ReactMapGL
        style={{ height: "100%" }}
        // {...viewport}
        mapboxAccessToken="pk.eyJ1IjoiZ2Fua2h1bHVnIiwiYSI6ImNsY2dtZnM4cTAybXQzdnA1aHhqb2U1NnkifQ.awd0eQDFkhJp7S_5cSPztQ"
        mapStyle="mapbox://styles/mapbox/streets-v12"
        projection="globe"
      >
        {/* <Marker latitude={55.755825} longitude={37.6173}></Marker> */}
        {/* <Marker
        latitude={55.755825} longitude={37.6173}></Marker> */}
        {fmStation.features.slice(0,1000).map((fm, idx) => {
          // console.log(fm);
          return (
            <Marker
              key={idx}
              offsetTop={(-viewport.zoom * 5) /2}
              latitude={fm.geometry.coordinates[1]}
              longitude={fm.geometry.coordinates[0]}
            //   width={viewport.zoom * 10}
            //   height={viewport.zoom * 10}
            //   onDrag
            >
               <IoRadioOutline color="green" style={{width:"20px",height:"20px"}}/>
            </Marker>
          );
        })}
      </ReactMapGL>
      {/* <ReactMapGL
          {...viewport}
          mapboxAccessToken="pk.eyJ1IjoiZ2Fua2h1bHVnIiwiYSI6ImNsY2dtZnM4cTAybXQzdnA1aHhqb2U1NnkifQ.awd0eQDFkhJp7S_5cSPztQ"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onvie
        //   onViewportChange={(viewport) => {
        //     setViewport(viewport);
        //   }}
        >
          {fmStation.features.map((fm, idx) => {
            // console.log(fm);
            <Marker
              key={idx}
              latitude={fm.geometry.coordinates[1]}
              longitude={fm.geometry.coordinates[0]}
            >
             <button style={{height:"100px", backgroundColor:"red"}}>FM</button>
            </Marker>;
          })}
          Markers
        </ReactMapGL> */}
    </div>
  );
}
