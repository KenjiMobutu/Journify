import "./list.css"
import Userinfo from "../../components/list/userInfo/UserInfo.jsx"
import ChatList from "../../components/list/chatList/ChatList.jsx"
const List = () => {
  return (
    <div className='list'>
      <Userinfo />
      <ChatList />
    </div>
  )
}

export default List
