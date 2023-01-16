import { createContext, useEffect, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import MyMap from "./map";
import "./style.css";
import MapBoxSearch from "./search";
import { useNavigate, useParams } from "react-router-dom";
export const RadioStationContext = createContext();

export default function RadioGaga() {
  const [radioList, setRadioList] = useState();
  const [currentChannel, setCurrentChannel] = useState();
  const [isThemeDark, setIsThemeDark] = useState(false);
  const { radioId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
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
        <MapBoxSearch />
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
                color: isThemeDark ? "#f1c40f" : "red",
              }}
              className="h5Player-span"
            >
              {currentChannel?.name}
            </span>
          }
          footer={
            <span
              style={{
                color: isThemeDark ? "#f1c40f" : "red",
              }}
              className="h5Player-span"
            >
              {currentChannel?.location}
            </span>
          }
          volume={0.3}
          showSkipControls={false}
          showJumpControls={false}
          // autoPlayAfterSrcChange={true}
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
