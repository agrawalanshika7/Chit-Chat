import "./list.css"
import ChatList from "./chatList/ChatList"
import Userinfo from "./userInfo/Userinfo"
import Logout from "./logout/Logout"

const List = (props) => {
    return (
        <div className="list">
            <Userinfo />
            <ChatList changeList={props.changeList}/>
            <Logout />
        </div>
    )
}

export default List