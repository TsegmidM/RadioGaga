import { createContext, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import { useNavigate } from "react-router-dom";
import MyMap from "./map";
import "./style.css";
import MapBoxSearch from "./search";

export const RadioStationContext = createContext();

export default function RadioGaga() {
  const [radioList, setRadioList] = useState();
  const [currentChannel, setCurrentChannel] = useState();
  const navigate = useNavigate();

  return (
    <RadioStationContext.Provider
      value={{ setCurrentChannel, setRadioList, radioList, currentChannel }}
    >
      <div className="radioMain">
        {/* <Button
          onClick={() => {
            navigate("Map");
          }}
        >
          GO TO MAP
        </Button> */}
        <MapBoxSearch />
        <H5AudioPlayer
          className="h5AudioPlayer"
          header={<span className="h5Player-span">{currentChannel?.name}</span>}
          footer={<span className="h5Player-span">{currentChannel?.location}</span>}
          showSkipControls={false}
          showJumpControls={false}
          //  autoPlayAfterSrcChange={true}
          showFilledProgress={false}
          hasDefaultKeyBindings={false}
          layout={"stacked"}
          customAdditionalControls={[]}
          
          customProgressBarSection={
            [
              // <div>Hi</div>,
              // RHAP_UI.CURRENT_TIME,
              // RHAP_UI.CURRENT_LEFT_TIME,
              // RHAP_UI.DURATION
              
            ]
          }
          autoPlay
          src={currentChannel?.url}
          // onPlay={(e) => console.log("onPlay")}
        ></H5AudioPlayer>
        <MyMap className="RadioMap" />
      </div>
    </RadioStationContext.Provider>
  );
}
