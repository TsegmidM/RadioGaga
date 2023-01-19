import { createContext, useEffect, useReducer, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import MyMap from "./map";
import "./style.css";
import MapBoxSearch from "./search";
import { useNavigate, useParams } from "react-router-dom";
import FavStations from "./favouriteStations";
import axios from "axios";
export const RadioStationContext = createContext();
const reducerChannels = (currState, action) => {
  switch (action.type) {
    case "addToFavourite":
      return {
        channels: [...currState.channels, action.data],
        channelIds: [...currState.channelIds, action.data.channelId],
      };
    case "RemoveFromFavourite":
      return {
        channels: currState.channels.filter(
          (channel) => channel.channelId !== action.data.channelId
        ),
        channelIds: currState.channelIds.filter(
          (id) => id !== action.data.channelId
        ),
      };
    default:
      window.alert("error!");
  }
};

export default function RadioGaga() {
  const [radioList, setRadioList] = useState();
  const [currentChannel, setCurrentChannel] = useState();
  const [viewport, setViewport] = useState({
    country: "",
    coordinates: { latitude: "", longitude: "" },
  });

  const [isThemeDark, setIsThemeDark] = useState(false);
  const [favouriteChannels, updateFavouriteChannels] = useReducer(
    reducerChannels,
    localStorage.getItem("favStations")
      ? JSON.parse(localStorage.getItem("favStations"))
      : { channels: [{}], channelIds: [] }
  );

  const { radioId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("favStations", JSON.stringify(favouriteChannels));
  }, [favouriteChannels]);

  useEffect(() => {
    axios.get("https://radio.garden/api/geo").then((res) => {
      setViewport({
        country: res.data.country_name,
        coordinates: {
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          zoom: 5,
        },
      });
    });
    if (radioId !== "search") {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <RadioStationContext.Provider
      value={{
        setCurrentChannel,
        setRadioList,
        radioList,
        currentChannel,
        isThemeDark,
        favouriteChannels,
        updateFavouriteChannels,
        viewport,
        setViewport,
      }}
    >
      <div className="radioMain">
        <button
          className="radiogaga-theme"
          style={{
            color: isThemeDark ? "#f1c40f" : "f39c12",
            backgroundColor: isThemeDark ? "#696969" : "white",
          }}
          onClick={() => {
            setIsThemeDark(!isThemeDark);
          }}
        >
          {isThemeDark ? <MdDarkMode /> : <MdLightMode />}
        </button>

        <button
          className="radiogaga-reset"
          style={{
            color: isThemeDark ? "#f1c40f" : "green",
            backgroundColor: isThemeDark ? "#696969" : "white",
          }}
          onClick={() => {
            setViewport({});
          }}
        >
          Show all radio stations
        </button>
        <MapBoxSearch />
        <FavStations />
        <H5AudioPlayer
          className="h5AudioPlayer"
          style={{
            color: isThemeDark ? "#f1c40f" : "black",
            backgroundColor: isThemeDark ? "#696969" : "transparent",
            opacity: "unset",
          }}
          header={
            <span
              style={{
                color: isThemeDark ? "#f1c40f" : "green",
              }}
              className="h5Player-span"
            >
              {currentChannel?.name}
            </span>
          }
          footer={
            <span
              style={{
                color: isThemeDark ? "#f1c40f" : "green",
              }}
              className="h5Player-span"
            >
              {currentChannel?.location}
            </span>
          }
          volume={0.3}
          showSkipControls={false}
          showJumpControls={false}
          showFilledProgress={false}
          hasDefaultKeyBindings={false}
          layout={"stacked"}
          customAdditionalControls={[]}
          customProgressBarSection={[]}
          autoPlay
          src={currentChannel?.url}
        ></H5AudioPlayer>
        <MyMap className="RadioMap" />
      </div>
    </RadioStationContext.Provider>
  );
}
