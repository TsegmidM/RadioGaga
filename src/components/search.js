import { Input, Modal } from "antd";
import { RadioStationContext } from ".";
import { useContext, useState } from "react";
import axios from "axios";
import "./style.css";
import { MAPBOXTOKEN } from "./MapBoxTOKEN";
import { useNavigate, useParams } from "react-router-dom";
import { MdFavorite, MdFavoriteBorder, MdOutlineRadio } from "react-icons/md";
export default function MapBoxSearch() {
  const navigate = useNavigate();
  const { radioId } = useParams();
  const [modal2Open, setModal2Open] = useState(false);
  const { Search } = Input;
  const {
    setCurrentChannel,
    radioList,
    setRadioList,
    favouriteChannels,
    updateFavouriteChannels,
  } = useContext(RadioStationContext);
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
        onSearch={onSearch}
        onChange={() => {
          navigate("/search");
        }}
        autoFocus={radioId === "search" ? true : false}
      />
      {radioList?.length > 0 && (
        <Modal
          title={
            <span>
              Choose the radio!
              <MdOutlineRadio style={{ color: "green" }} />
            </span>
          }
          style={{
            textAlign: "center",
          }}
          width="30vw"
          centered
          footer={null}
          open={modal2Open}
          onOk={() => {
            setModal2Open(false);
          }}
          onCancel={() => {
            setModal2Open(false);
            setCurrentChannel((currState) => {
              return { ...currState, coordinates: null };
            });
          }}
        >
          <div>
            {radioList?.slice(0, 8).map((radio, idx) => {
              const parts = radio?._source.url.split("/");
              const channelId = parts[parts.length - 1];
              return (
                <div key={idx} className="stationOnModal-container">
                  <div
                    className="stationOnModal"
                    style={{
                      textAlign: "center",
                      marginBottom: "5px",
                    }}
                    onClick={() => {
                      navigate(`/${parts}`);
                      viewPortHandler(
                        radio?._source.subtitle,
                        radio._source.title,
                        `https://radio.garden/api/ara/content/listen/${channelId}/channel.mp3`
                      );
                    }}
                  >
                    <span>{radio?._source.subtitle}</span>
                    <span>{radio?._source.title}</span>
                  </div>
                  <span
                    onClick={() => {
                      updateFavouriteChannels({
                        type: favouriteChannels.channelIds?.includes(channelId)
                          ? "RemoveFromFavourite"
                          : "addToFavourite",
                        data: {
                          channelId: channelId,
                          channelName: radio._source.title,
                          url: parts,
                        },
                      });
                    }}
                  >
                    {favouriteChannels.channelIds?.includes(channelId) ? (
                      <MdFavorite color="red"/>
                    ) : (
                      <MdFavoriteBorder />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}
