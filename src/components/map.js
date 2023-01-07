import { Button, Modal, Popover } from "antd";
import { useContext, useEffect, useState } from "react";
import ReactMapGL, { Source, Layer, Marker, Popup } from "react-map-gl";
import fmStation from "./geo.json";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import { MAPBOXTOKEN } from "./MapBoxTOKEN";
import { PlayCircleFilled } from "@ant-design/icons";
import { RadioStationContext } from ".";
export default function MyMap() {
  const [radioList, setRadioList] = useState();

  const [showPopup, setShowPopup] = useState("");
  const { setCurrentChannel } = useContext(RadioStationContext);
  const layer = {
    id: "countries",
    type: "circle",
    source: "countriesall",
    // "source-layer": "country_boundaries",
    // filter:'worldviewFilter',
    paint: {
      'circle-radius': {
        'base': 1.75,
        'stops': [
        [12, 2],
        [22, 180]
        ]
        },
      // "base": 1,
      // "stops":[[12,2],[22,180]],
      "circle-color": "red",
      // 'circle-wi'
      "circle-stroke-width": 0.1,
      "circle-stroke-color": "white",
      'circle-opacity': 1
    },
  };

  const getChannelsbyId = (channelId) => {
    axios
      .get(
        `https://api.allorigins.win/raw?url=https://radio.garden/api/ara/content/page/${channelId}/channels`
      )
      .then((res) => {
        console.log("Hi", res.data.data.content[0].items);
        setRadioList(res.data.data.content[0].items);
        // window.alert(res.data.data.content[0].items)
      })
      .catch((err) => {
        if (err.status === 404) {
          console.error("404!");
        }
      });
  };
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
  // useEffect(() => {
  //   setViewport({
  //     // latitude: chosenRadio.coordinates?.lat,
  //     // longitude: chosenRadio.coordinates?.long,
  //     width: "80vw",
  //     height: "80vh",
  //     zoom: 3,
  //     transitionDuration: 1000,
  //   });
  // }, [chosenRadio]);
  return (
    <div style={{ height: "100vh" }}>
      <ReactMapGL
        // id="EhDelhii"
        {...viewport}
        zoom="2"
        style={{ height: "100%" }}
        mapboxAccessToken={MAPBOXTOKEN.KEY}
        mapStyle="mapbox://styles/mapbox/streets-v12/"
        projection="globe"
        minZoom="3"
        onMouseMove={(e) => {
          // {Sh}

          if (e.features[0]) {
            getChannelsbyId(e.features[0].properties?.location_id);
            setShowPopup({
              lngLat: e.lngLat,
              title: e.features[0].properties.title,
            });
          }
        }}
        onClick={(e) => {
          // getChannelsbyId(e.features[0].properties.location_id);
          // if (e.features[0]) {
          //   getChannelsbyId(e.features[0].properties?.location_id);
          //   setShowPopup({
          //     lngLat: e.lngLat,
          //     title: e.features[0].properties.title,
          //   });
          // }
          // e.features[0]?.properties &&
          // window.alert(e.features[0]?.properties.title);
          // setShowPopup(e.features[0]);
          // e.features[0] && setShowPopup({lngLat:e.lngLat});
          // return(
          // <Popup></Popup>
          // )
          // console.log(e.features[0].properties);
        }}
        interactiveLayerIds={[layer.id]}
      >
        {showPopup && (
          <Popup
            style={{ width: "10vw", height: "20vh" }}
            longitude={showPopup.lngLat.lng}
            latitude={showPopup.lngLat.lat}
            anchor="bottom"
            onClose={() => setShowPopup("")}
          >
            {radioList?.map((radio) => {
              const parts = radio?.href?.split("/");
              const channelId = parts[parts?.length - 1];
              return (
                <div>
                  <div>
                    <span>{radio.title}</span>
                    <PlayCircleFilled
                      onClick={() => {
                        setCurrentChannel({
                          name: radio.title,
                          url: `https://radio.garden/api/ara/content/listen/${channelId}/channel.mp3`,
                        });
                      }}
                      style={{ backgroundColor: "white", color: "red" }}
                    ></PlayCircleFilled>
                  </div>
                </div>
              );
            })}
          </Popup>
        )}
        <Source
          id="countriesall"
          type="geojson"
          // url="mapbox://mapbox.country-boundaries-v1"
          data={fmStation}
        >
          <Layer {...layer} />
        </Source>
        {/* <Marker
          offsetTop={(-viewport.zoom * 5) / 2}
          {...viewport}
          // onDrag
          latitude={chosenRadio.coordinates?.lat}
          longitude={chosenRadio.coordinates?.long}
        ></Marker> */}
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
      {/* <GeolocateControl
      positionOptions={{ enableHighAccuracy: true }}
      trackUserLocation={true}>
        
      </GeolocateControl> */}
    </div>
  );
}
