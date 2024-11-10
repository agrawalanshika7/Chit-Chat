import { useEffect, useState } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import DetailGroup from "./components/detail/DetailGroup"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"
import { useGroupChatStore } from "./lib/groupChatStore"
import ChatDefault from "./components/chat/ChatDefault"
import ChatGroup from "./components/chat/ChatGroup"

const App = () => {
  const user = false;

  const {currentUser, isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatStore();
  const {groupChatId} = useGroupChatStore();
  const [showDetail, setShowDetail] = useState(false);
  const [showGroupDetail, setShowGroupDetail] = useState(false);
  const [showList, setShowList] = useState(true);

  function changeDetail() {
    setShowGroupDetail(false);
    setShowDetail(prev => !prev);
  }

  function changeGroupDetail() {
    setShowDetail(false);
    setShowGroupDetail(prev => !prev);
  }

  function changeList() {
    document.getElementsByClassName("list")[0].classList.toggle("active");
  }

  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      onSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List changeList={changeList} />
            {chatId ? <Chat changeDetail={changeDetail} changeList={changeList} /> : groupChatId ? <ChatGroup changeGroupDetail={changeGroupDetail} changeList={changeList}/> : <ChatDefault changeList={changeList}/>}
            {showDetail && <Detail changeDetail={changeDetail} />}
            {showGroupDetail && <DetailGroup changeGroupDetail={changeGroupDetail} />}
          </>
        ) : (<Login />)
      }
      <Notification />
    </div>
  )
}

export default App