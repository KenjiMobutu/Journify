import "./list.css"
import Userinfo from "../../components/list/userInfo/UserInfo.jsx"
import ChatList from "../../components/list/chatList/ChatList.jsx"
const List = ({userFriends, fetchUserFriends}) => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList userFriends={userFriends} fetchUserFriends={fetchUserFriends}/>
    </div>
  )
}

export default List
