  import { useContext, useEffect, useState } from "react";
  import ReactMapGL, {
    Source,
    Layer,
    Popup,
    NavigationControl,
  } from "react-map-gl";
  import fmStation from "./geo.json";
  import "mapbox-gl/dist/mapbox-gl.css";
  import axios from "axios";
  import { MAPBOXTOKEN } from "./MapBoxTOKEN";
  import { PlayCircleFilled } from "@ant-design/icons";
  import { RadioStationContext } from ".";
  export default function MyMap() {
    const [radioList, setRadioList] = useState();
    const [cursor, setCursor] = useState("");
    const [showPopup, setShowPopup] = useState("");
    const { setCurrentChannel, currentChannel } = useContext(RadioStationContext);
    const layer = {
      id: "country",
      type: "circle",
      source: "countriesall",
      interactive: true,
      paint: {
        "circle-radius": {
          base: 1.75,
          stops: [
            [12, 2],
            [22, 180],
          ],
        },
        "circle-color": "red",
        "circle-stroke-width": 20,
        "circle-stroke-color": "transparent",
      },
    };

    const getChannelsbyId = (channelId) => {
      axios
        .get(
          `https://api.allorigins.win/raw?url=https://radio.garden/api/ara/content/page/${channelId}/channels`
        )
        .then((res) => {
          setRadioList(res.data.data.content[0].items);
        })
        .catch((err) => {
          if (err.status === 404) {
            console.error("404!");
          }
        });
    };
    const [viewport, setViewport] = useState({});
    useEffect(() => {
      if (currentChannel?.coordinates) {
        setViewport({
          latitude: currentChannel?.coordinates?.lat,
          longitude: currentChannel?.coordinates?.long,
          zoom: 5.5,
        });
      } else {
        setViewport({});
      }
    }, [currentChannel?.coordinates]);

    return (
      <div style={{ height: "100vh" }}>
        <ReactMapGL
          {...viewport}
          // zoom="2"
          style={{ height: "100%" }}
          mapboxAccessToken={MAPBOXTOKEN.KEY}
          mapStyle="mapbox://styles/mapbox/streets-v12/"
          projection="globe"
          // minZoom="5"
          maxZoom="5.5"
          cursor={cursor}
          onMouseMove={(e) => {
            if (e.features && e.features.length > 0) {
              setCursor("pointer");
            } else {
              setCursor("");
            }
          }}
          onClick={(e) => {
            // console.log(e);
            if (!showPopup && e.features[0]) {
              getChannelsbyId(e.features[0].properties?.location_id);
              setShowPopup({
                lngLat: e.lngLat,
                title: e.features[0].properties.title,
              });
            } else setShowPopup("");
          }}
          interactiveLayerIds={[layer.id]}
        >
          <NavigationControl></NavigationControl>
          {radioList && showPopup && (
            <Popup
              style={{ width: "10vw", height: "20vh" }}
              longitude={showPopup.lngLat.lng}
              latitude={showPopup.lngLat.lat}
              anchor="bottom-left"
              // onOpen={() => console.log(showPopup, "ssd")}
              // closeOnClick={() => setShowPopup(null)}
              onClose={() => {
                setShowPopup(null);
                setRadioList(null);
              }}
            >
              {radioList?.slice(0, 10).map((radio, idx) => {
                // console.log(radio);
                const parts = radio?.href?.split("/");
                const channelId = parts[parts?.length - 1];
                return (
                  <div key={idx}>
                    <div>
                      <span>{radio.title}</span>
                      <PlayCircleFilled
                        onClick={() => {
                          setShowPopup(null);
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
          </Source>
          <Layer {...layer} />
        </ReactMapGL>
      </div>
    );
  }
