import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { useGroupChatStore } from "../../../lib/groupChatStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import MakeGroup from "./makeGroup/MakeGroup";

const ChatList = (props) => {
    const [chats, setChats] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [makeMode, setMakeMode] = useState(false);
    const [input, setInput] = useState("");
    const [filter, setFilter] = useState("Users");

    const {currentUser} = useUserStore();
    const {chatId, changeChat, resetChat} = useChatStore();
    const {changeGroupChat, resetGroupChat} = useGroupChatStore();

    const handleAddMode = () => {
        setAddMode(prev => !prev);
    }

    const handleMakeMode = () => {
        setMakeMode(prev => !prev);
    }

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return {...item, user}
            })

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        const unSubGroup = onSnapshot(doc(db, "usergroupchats", currentUser.id), async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const chatDocRef = doc(db, "chats", item.chatId);
                const chatDocSnap = await getDoc(chatDocRef);

                const chat = chatDocSnap.data();

                return {...item, chat}
            })

            const chatData = await Promise.all(promises);

            setGroupChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
            unSubGroup();
        }
    }, [currentUser.id]);

    const handleUserSelect = async(chat) => {
        const userChats = chats.map((item) => {
            const {user, ...rest} = item;
            return rest;
        })

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats
            })
            
            
            changeChat(chat.chatId, chat.user);
            resetGroupChat();
            props.changeList();
        } catch (err) {
            console.log(err);
        }

    }

    const handleGroupSelect = async(chat) => {
        const userGroupChats = groupChats.map((item) => {
            const {chat, ...rest} = item;
            return rest;
        })
        const chatIndex = userGroupChats.findIndex(item => item.chatId === chat.chatId)

        userGroupChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "usergroupchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userGroupChats
            })
            changeGroupChat(chat.chatId, chat.chat.name, chat.chat.description, chat.chat.avatar, chat.members);
            resetChat();
            props.changeList();
        } catch (err) {
            console.log(err);
        }
    }
    

    const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(input.toLowerCase()))
    const filteredGroupChats = groupChats.filter((c) => c.chat.name.toLowerCase().includes(input.toLowerCase()))

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="search" />
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)}/>
                </div>
                <div className="addContainer">
                    <div className="add" onClick={handleAddMode}>Add User</div>
                    <div className="make" onClick={handleMakeMode}>Make a Group</div>
                </div>
                <div className="filterContainer">
                    <div className={filter === "Users" ? "filterUsers active" : "filterUsers"} onClick={() => setFilter("Users")}>
                        <img src="./user.png" alt="user" />
                        <p>Users</p>
                    </div>
                    <div className={filter === "Groups" ? "filterGroups active" : "filterGroups"} onClick={() => setFilter("Groups")}>
                        <img src="./group.png" alt="group" />
                        <p>Groups</p>
                    </div>
                </div>
            </div>
            {filter === "Users" && filteredChats.map((chat) => {
                let lastMessage = [...chat.lastMessage];
                if (lastMessage.length > 30) {
                    lastMessage = [lastMessage.splice(0, 27) , ".", ".", "."];
                }
                return (
                    <div className="item" key={chat.chatId} onClick={() => handleUserSelect(chat)} style={{backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"}}>
                        <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="avatar" />
                        <div className="texts">
                            <span>{chat.user.username}</span>
                            <p>{lastMessage}</p>
                        </div>
                    </div>
                )
            })}
            {filter === "Groups" && filteredGroupChats.map((userGroupChat) => {
                let lastMessage = [...userGroupChat.lastMessage];
                if (lastMessage.length > 30) {
                    lastMessage = [lastMessage.splice(0, 27) , ".", ".", "."];
                }
                
                return (
                    <div className="item"  onClick={() => handleGroupSelect(userGroupChat)} style={{backgroundColor: userGroupChat?.isSeen ? "transparent" : "#5183fe"}}>
                        <img src={userGroupChat.chat.avatar || "./avatar.png"} alt="avatar" />
                        <div className="texts">
                            <span>{userGroupChat.chat.name}</span>
                            <p>{lastMessage}</p>
                        </div>
                    </div>
                )
            })}
            {addMode && <AddUser changeAddMode={handleAddMode}/>}
            {makeMode && <MakeGroup changeMakeMode={handleMakeMode}/>}
        </div>
    )
}

export default ChatList