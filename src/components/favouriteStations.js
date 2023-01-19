import { Drawer } from "antd";
import { useContext, useState } from "react";
import { MdFavorite, MdFavoriteBorder, MdOutlineRadio } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RadioStationContext } from ".";

export default function FavStations() {
  const {
    favouriteChannels,
    updateFavouriteChannels,
    setCurrentChannel,
    isThemeDark,
  } = useContext(RadioStationContext);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  return (
    <div>
      <MdFavorite
        className="favourite-stations"
        color={isThemeDark ? "#f1c40f" : "red"}
        size={25}
        // onMouseEnter={() => {
        //   // setModal2Open(true);

        // }}\
        onClick={showDrawer}
      />
      <Drawer
      // width={400}
      headerStyle={{backgroundColor: isThemeDark ? "#f1c40f" : "green"}}
      bodyStyle={{ backgroundColor: isThemeDark ? "#696969" : "white", color: isThemeDark ? "white" : "black",}}
      height={400}
        title={
          <span>
            <MdFavorite color="red" size={25} /> Your Favourite Stations
            <MdOutlineRadio style={{ color: "red" }} />
          </span>
        }
        placement="right"
        onClose={onClose}
        open={open}
        // height={500}
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
      </Drawer>
    </div>
  );
}
