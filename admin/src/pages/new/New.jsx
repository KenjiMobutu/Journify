import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./new.scss"
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const New = () => {
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New User</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src="https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1" alt="" />
          </div>

          <div className="right">
            <form>
              <div className="formInput">
                <label>Username</label>
                <input type="text" placeholder="Username" />
              </div>
              <div className="formInput">
                <label>Email</label>
                <input type="text" placeholder="Email" />
              </div>
              <div className="formInput">
                <label>Password</label>
                <input type="text" placeholder="Password" />
              </div>
              <div className="formInput">
                <label>Confirm Password</label>
                <input type="text" placeholder="Confirm Password" />
              </div>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <AddPhotoAlternateOutlinedIcon className="addImageIcon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <div className="formInput">
                <label>User Status</label>
                <select>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="create">Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default New
