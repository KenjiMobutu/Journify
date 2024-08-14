import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./newRoom.scss"
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useFetch from "../../hooks/useFetch";

const NewRoom = ({ inputs, title }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [roomNumbers, setRoomNumbers] = useState("");
  const [hotelId, setHotelId] = useState(undefined);
  const roomTypes = ['Single', 'Double', 'Triple', 'Quad', 'Queen', 'King', 'Twin'];
  const { data, loading, error } = useFetch("/api/hotels");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rooms = roomNumbers.split(",").map((room) => ({ number: room.trim() }));
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const response = await axios.post("https://api.cloudinary.com/v1_1/dlzpg0hgw/image/upload", data);
          return response.data.url;
        })
      );
      const newRoom = { ...info, photos: list, roomNumbers: rooms };
      await axios.post(`/api/rooms/${hotelId}`, newRoom);
      navigate("/rooms");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={files
              ? URL.createObjectURL(files[0])
              : "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
            } alt="" />
          </div>

          <div className="right">
            <form>
              <div className="formInput">
                <label>Room Type</label>
                <select
                  id="roomType"
                  value={info.roomType || ""}
                  onChange={handleChange}
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formInput">
                <label>Room Numbers</label>
                <textarea
                  id="roomNumbers"
                  placeholder='Room number, ex: "101, 102, 103"'
                  value={roomNumbers}
                  onChange={e => setRoomNumbers(e.target.value)}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    id={input.id}
                    value={info[input.id] || ""}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    min={input.min}
                    max={input.max}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Choose a Hotel</label>
                <select id="hotelId" onChange={e => setHotelId(e.target.value)}>
                  {loading ? "Loading..." : data && data.map((hotel) => (
                    <option key={hotel._id} value={hotel._id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label htmlFor="file">
                  Image: <AddPhotoAlternateOutlinedIcon className="addImageIcon" />
                </label>
                <input
                  multiple
                  type="file"
                  id="file"
                  onChange={e => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>
              <button className="create" onClick={handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewRoom;
