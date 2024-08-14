import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./newHotel.scss"
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useFetch from "../../hooks/useFetch";

const NewHotel = ({ inputs, title }) => {
  const navigate = useNavigate();
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);

  const { data, loading, error } = useFetch("/api/rooms");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelect = (e) => {
    // HTMLCollection to Array
    const valueRoom = Array.from(e.target.selectedOptions, (option) => option.value);
    console.log(valueRoom);
    setRooms(valueRoom);

  }

  console.log(rooms);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const hotel = { ...info, photos: list || undefined, rooms };
      await axios.post("/api/hotels", hotel);
      navigate("/hotels");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(info);

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

              <div className="formInput">
                <label>Featured</label>
                <select
                  id="featured"
                  value={info.featured}
                  onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>

              <div className="roomsSelection">
                <label>Rooms</label>
                <select
                  multiple
                  id="rooms"
                  value={info.featured}
                  onChange={handleSelect}>
                  {loading ? "Loading..." : data && data.map((room) => (
                    <option key={room._id} value={room._id}>{room.roomType}</option>
                  ))}
                </select>
              </div>
              <button className="create" onClick={handleSubmit}>Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewHotel
