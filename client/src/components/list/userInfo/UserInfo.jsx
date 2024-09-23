import "./userInfo.css"
import { useContext } from "react";
import { AuthenticationContext } from "../../../context/AuthenticationContext";
import more from '../../../assets/more.png';
import video from '../../../assets/video.png';
import edit from '../../../assets/edit.png';
import nobody from '../../../assets/nobody.png';

const UserInfo = () => {
  const { user } = useContext(AuthenticationContext);
  console.log(user)
  return (
    <div className='userInfo'>
      <div className="user">
        <img src={user.img || nobody} alt="" />
        <h2>{user.userName}</h2>
      </div>
      {/* <div className="icons">
        <img src={more} alt="" />
        <img src={video} alt="" />
        <img src={edit }alt="" />
      </div> */}
    </div>
  )
}

export default UserInfo
