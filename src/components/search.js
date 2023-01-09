import Search from "antd/es/transfer/search";
import { Input, Modal } from "antd";
import { RadioStationContext } from ".";
import { useContext, useState } from "react";
import axios from "axios";
import "./style.css";
import { MAPBOXTOKEN } from "./MapBoxTOKEN";
import { PlayCircleFilled, PlayCircleOutlined } from "@ant-design/icons";

export default function MapBoxSearch() {
  const [modal2Open, setModal2Open] = useState(false);
  const { Search } = Input;
  const { setCurrentChannel, radioList, setRadioList } =
    useContext(RadioStationContext);
  const viewPortHandler = (location, name, url) => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?types=place&access_token=${MAPBOXTOKEN.KEY}`
      )
      .then((res) => {
        const filteredRadio = res.data.features;
        // console.log(
        //   res.data.features.filter((reg) => reg.place_name === location)
        // );
        setCurrentChannel({
          location: location,
          name: name,
          url: url,
          coordinates: {
            long: filteredRadio[0]?.center[0],
            lat: filteredRadio[0]?.center[1],
          },
        });
      })
      .finally(() => {
        setModal2Open(false);
        setTimeout(() => {
          setCurrentChannel((currState) => {
            return { ...currState, coordinates: null };
          });
        }, 0);
      });
  };
  const fetchRadioStations = (value) => {
    axios
      .get(
        // `https://cors-anywhere.herokuapp.com/https://radio.garden/api/search?q=${value}`
        `https://api.allorigins.win/raw?url=https://radio.garden/api/search?q=${value}`
      )
      .then((res) => {
        // console.log(res.data.hits.hits);
        setRadioList(
          res.data.hits.hits.filter((val) => val._source.type === "channel")
        );
      })
      .then(() => {
        if (value) setModal2Open(true);
      })
      .catch((err) => {
        if (err.status === 404) {
          console.error("404!");
        }
      });
  };

  const onSearch = (value) => {
    fetchRadioStations(value);
  };
  return (
    <div className="search-box">
      <Search
        className="search-box-input"
        placeholder="Search radio"
        allowClear
        // enterButton="Search"
        // size="large"
        onSearch={onSearch}
        // enterButton
        
      />
      {radioList?.length > 0 && (
        <Modal
          // title="Radio Stations"
          centered
          footer={null}
          open={modal2Open}
          onOk={() => setModal2Open(false)}
          onCancel={() => {
            setModal2Open(false);
            setCurrentChannel((currState) => {
              return { ...currState, coordinates: null };
            });
          }}
        >
          {radioList?.slice(0, 8).map((radio, idx) => {
            const parts = radio?._source.url.split("/");
            const channelId = parts[parts.length - 1];
            return (
              <div key={idx}>
                <span></span>
                {radio?._source.subtitle}
                {radio?._source.title}

                <button
                  onClick={() => {
                    viewPortHandler(
                      radio?._source.subtitle,
                      radio._source.title,
                      `https://radio.garden/api/ara/content/listen/${channelId}/channel.mp3`
                    );
                  }}
                >
                  <PlayCircleFilled />
                </button>
              </div>
            );
          })}
        </Modal>
      )}
    </div>
  );
}
