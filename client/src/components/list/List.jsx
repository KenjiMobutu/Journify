import "./list.css"
import Userinfo from "../../components/list/userInfo/UserInfo.jsx"
import ChatList from "../../components/list/chatList/ChatList.jsx"
const List = ({userFriends}) => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList userFriends={userFriends}/>
    </div>
  )
}

export default List
