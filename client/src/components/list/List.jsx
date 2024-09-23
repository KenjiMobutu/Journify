import "./list.css"
import Userinfo from "../../components/list/userInfo/UserInfo.jsx"
import ChatList from "../../components/list/chatList/ChatList.jsx"
const ListChat = ({userFriends, fetchUserFriends, groups}) => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList userFriends={userFriends} fetchUserFriends={fetchUserFriends} groups={groups}/>
    </div>
  )
}

export default ListChat
