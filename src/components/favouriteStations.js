import { Modal } from "antd";
import { useContext, useState } from "react";
import { MdFavorite, MdFavoriteBorder, MdOutlineRadio } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RadioStationContext } from ".";

export default function FavStations() {
  const { favouriteChannels, updateFavouriteChannels,setCurrentChannel,isThemeDark } =
    useContext(RadioStationContext);
  const [modal2Open, setModal2Open] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className="favourite-stations"
      style={{ backgroundColor: isThemeDark ? "#696969" : "white",
      color: isThemeDark ? "#f1c40f" : "red",}}
      onMouseEnter={() => {
        setModal2Open(true);
      }}
    >
      <span>Your Favourite Stations!</span>
      <Modal
        title={
          <span>
            <MdFavorite color="red" size={25} /> Your Favourite Stations
            <MdOutlineRadio style={{ color: "green" }} />
          </span>
        }
        style={{
          textAlign: "center",
        }}
        width="30vw"
        //   centered
        footer={null}
        open={modal2Open}
        onCancel={() => {
          setModal2Open(false);
        }}
      >
        {favouriteChannels.channelIds.length > 0
          ? favouriteChannels.channels?.map((channel, idx) => {
              return (
                <div className="stationOnModal-container" key={idx}>
                  <div
                    className="stationOnModal"
                    onClick={() => {
                      navigate(`/${channel.url}`);
                      setCurrentChannel({
                        name: channel.channelName,
                        url: `https://radio.garden/api/ara/content/listen/${channel.channelId}/channel.mp3`,
                      });
                    }}
                  >
                    {channel.channelName}
                  </div>
                  <span
                    onClick={() => {
                      updateFavouriteChannels({
                        type: favouriteChannels.channelIds?.includes(
                          channel.channelId
                        )
                          ? "RemoveFromFavourite"
                          : "addToFavourite",
                        data: {
                          channelId: channel.channelId,
                          channelName: channel.channelName,
                        },
                      });
                    }}
                  >
                    {favouriteChannels.channelIds?.includes(
                      channel.channelId
                    ) ? (
                      <MdFavorite color="red" />
                    ) : (
                      <MdFavoriteBorder />
                    )}
                  </span>
                </div>
              );
            })
          : "There is no favourite station yet"}
      </Modal>
    </div>
  );
}
