import { Button, Input } from "antd";
import axios from "axios";
import { createContext, useRef, useState } from "react";
import H5AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import { PlayCircleOutlined } from "@ant-design/icons";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import "react-h5-audio-player/lib/styles.css";
import { useNavigate } from "react-router-dom";
import MyMap from "./map";
import { MAPBOXTOKEN } from "./MapBoxTOKEN";

export const RadioStaionContext = createContext();

export default function RadioGaga() {
  const [radioList, setRadioList] = useState();
  const [chosenRadio, setChosenRadio] = useState({
    location: "",
    coordinates: { long: "", lat: "" },
  });
  const [currentChannel, setCurrentChannel] = useState();
  const navigate = useNavigate();
  const { Search } = Input;

  const onSearch = (value) => {
    console.log(value);
    fetchRadioStations(value);
  };
  const viewPortHandler = (location) => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?types=place&access_token=${MAPBOXTOKEN.KEY}`
      )
      .then((res) => {
        const filteredRadio = res.data.features;
        console.log(
          res.data.features.filter((reg) => reg.place_name === location)
        );
        setChosenRadio({
          location: location,
          coordinates: {
            long: filteredRadio[0]?.center[0],
            lat: filteredRadio[0]?.center[1],
          },
        });
        
        // return filteredRadio[0].geometry.coordinates;
      });
    console.log(chosenRadio, "hi");
  };

  const fetchRadioStations = (value) => {
    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://radio.garden/api/search?q=${value}`
      )
      .then((res) => {
        console.log(res.data.hits.hits);

        setRadioList(
          res.data.hits.hits.filter((val) => val._source.type === "channel")
        );
      })
      .catch((err) => {
        if (err.status === 404) {
          console.error("404!");
        }
      });
  };

  return (
    <RadioStaionContext.Provider value={{ chosenRadio, viewPortHandler }}>
      <div>
        <Button
          onClick={() => {
            navigate("Map");
          }}
        >
          GO TO MAP
        </Button>
        <Search
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
        {radioList?.slice(0,5).map((radio, idx) => {
          const parts = radio?._source.url.split("/");
          const channelId = parts[parts.length - 1];
          return (
            <div key={idx}>
              {/* {radio?._id} */}
              {radio?._source.subtitle}
              {radio?._source.title}

              <button
                onClick={() => {
                  viewPortHandler(radio?._source.subtitle);
                  console.log(channelId); // Output: "AOpBYmMA"
                  // setChosenRadio({location:radio?._source.subtitle});
                  setCurrentChannel({
                    name: radio._source.title,
                    location: radio._source.subtitle,
                    url: `https://radio.garden/api/ara/content/listen/${channelId}/channel.mp3`,
                  });
                }}
              >
                {/* play */}
                {/* <PlayCircleOutlined/> */}
                <PlayCircleOutlined />
              </button>
              <MdOutlineFavoriteBorder />
            </div>
          );
        })}
        <H5AudioPlayer
          style={{
            // display: "flex",
            textAlign: "center",
            background: "linear-gradient(#9ce3ff 0%, #fd878d 90%)",
          }}
          header={currentChannel?.name}
          footer={currentChannel?.location}
          showSkipControls={false}
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
        {chosenRadio.location && <MyMap />}
      </div>
    </RadioStaionContext.Provider>
  );
}
