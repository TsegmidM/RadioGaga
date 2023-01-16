import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { RadioStationContext } from ".";
import { MdFavorite, MdFavoriteBorder, MdOutlineRadio } from "react-icons/md";
export default function MyMap() {
  const [radioList, setRadioList] = useState();
  const [cursor, setCursor] = useState("");
  const [showPopup, setShowPopup] = useState("");
  const navigate = useNavigate();
  const {
    setCurrentChannel,
    currentChannel,
    isThemeDark,
    favouriteChannels,
    updateFavouriteChannels,
  } = useContext(RadioStationContext);
  const layer = {
    id: "country",
    type: "circle",
    source: "countriesall",
    // interactive: true,
    paint: {
      "circle-radius": {
        base: 1.75,
        stops: [
          [12, 2],
          [22, 180],
        ],
      },
      "circle-color": isThemeDark ? "#f1c40f" : "red",
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
        preserveDrawingBuffer
        interactiveLayerIds={[layer.id]}
        {...viewport}
        // zoom="2"
        style={{ height: "100%" }}
        mapboxAccessToken={MAPBOXTOKEN.KEY}
        mapStyle={
          isThemeDark
            ? "mapbox://styles/mapbox/dark-v11"
            : "mapbox://styles/mapbox/streets-v12/"
        }
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
      >
        <NavigationControl
          visualizePitch={true}
          position="bottom-right"
          style={{
            backgroundColor: isThemeDark ? "#696969" : "white",
          }}
        ></NavigationControl>
        {radioList && showPopup && (
          <Popup
            style={{ width: "20vw", height: "20vh" }}
            longitude={showPopup.lngLat.lng}
            latitude={showPopup.lngLat.lat}
            anchor="bottom-left"
            closeButton={false}
            // onOpen={() => console.log(showPopup, "ssd")}
            // closeOnClick={() => setShowPopup(null)}
            onClose={() => {
              setShowPopup(null);
              setRadioList(null);
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "small",
              }}
            >
              <span className="radiolist-span">
                Choose the radio!
                <MdOutlineRadio style={{ color: "green" }} />
              </span>
            </div>
            {radioList?.slice(0, 8).map((radio, idx) => {
              // console.log(radio);
              const parts = radio?.href?.split("/");
              const channelId = parts[parts?.length - 1];
              return (
                <div className="stationOnModal-container" key={idx}>
                  <div
                    className="stationOnModal"
                    onClick={() => {
                      navigate(`/${parts}`);
                      setShowPopup(null);
                      setCurrentChannel({
                        name: radio.title,
                        url: `https://radio.garden/api/ara/content/listen/${channelId}/channel.mp3`,
                      });
                    }}
                  >
                    <span>{radio.title}</span>
                  </div>
                  <span
                    onClick={() => {
                      updateFavouriteChannels({
                        type: favouriteChannels.channelIds?.includes(channelId)
                          ? "RemoveFromFavourite"
                          : "addToFavourite",
                        data: {
                          channelId: channelId,
                          channelName: radio.title,
                          url: parts,
                        },
                      });
                      // console.log(favouriteChannels);
                    }}
                  >
                    {favouriteChannels.channelIds?.includes(channelId) ? (
                      <MdFavorite color="red" />
                    ) : (
                      <MdFavoriteBorder />
                    )}
                  </span>
                </div>
              );
            })}
          </Popup>
        )}
        <Source id="countriesall" type="geojson" data={fmStation}>
          <Layer {...layer} />
        </Source>
      </ReactMapGL>
    </div>
  );
}
