import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./new.scss";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const New = ({ inputs, title }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({ isAdmin: "false" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imgUrl = "";

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");
      try {
        const uploadResponse = await axios.post("https://api.cloudinary.com/v1_1/dlzpg0hgw/image/upload", data);
        imgUrl = uploadResponse.data.url;
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }

    const user = { ...info, img: imgUrl || undefined };
    try {
      await axios.post("/api/auth/register", user);
      navigate("/users");
    } catch (error) {
      console.log("Error registering user:", error);
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
            <img
              src={file ? URL.createObjectURL(file) : "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"}
              alt=""
            />
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
                  />
                </div>
              ))}
              <div className="formInput">
                <label>User Status</label>
                <select
                  id="isAdmin"
                  value={info.isAdmin}
                  onChange={handleChange}
                >
                  <option value="false">User</option>
                  <option value="true">Admin</option>
                </select>
              </div>

              <div className="formInput">
                <label htmlFor="file">
                  Image: <AddPhotoAlternateOutlinedIcon className="addImageIcon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={e => setFile(e.target.files[0])}
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
};

export default New;
