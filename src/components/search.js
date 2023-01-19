import { Input } from "antd";
import { RadioStationContext } from ".";
import { useContext, useState } from "react";
import axios from "axios";
import "./style.css";
import { MAPBOXTOKEN } from "./MapBoxTOKEN";
import { useNavigate, useParams } from "react-router-dom";
export default function MapBoxSearch() {
  const navigate = useNavigate();
  const { radioId } = useParams();
  const [isInputNull, setIsInputNull] = useState(true);
  const { Search } = Input;
  const {
    setViewport,
  } = useContext(RadioStationContext);
  

  const onSearch = (value) => {
    if (value) {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?types=country&access_token=${MAPBOXTOKEN.KEY}`
        )
        .then((res) => {
          setViewport({
            country: res.data.features[0].place_name,
            coordinates: {
              latitude: res.data.features[0].geometry.coordinates[1],
              longitude: res.data.features[0].geometry.coordinates[0],
            },
          });
        })
        .catch((err) => {
          console.log(err, "gi");
        });
    }
  };
  return (
    <div className="search-box" style={{ width: !isInputNull && "15vw" }}>
      <Search
        className="search-box-input"
        placeholder="Search radio"
        allowClear
        onSearch={onSearch}
        onChange={(e) => {
          if (e.target.value.length > 0) setIsInputNull(false);
          else {
            setIsInputNull(true);
          }
          navigate("/search");
        }}
        autoFocus={radioId === "search" ? true : false}
      />
    </div>
  );
}
