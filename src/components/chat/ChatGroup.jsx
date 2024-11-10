import { useEffect, useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import timeConverter from "../../lib/timeConverter";
import { toast } from "react-toastify";
import { useGroupChatStore } from "../../lib/groupChatStore";

const ChatGroup = (props) => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: ""
    });
    const [members, setMembers] = useState([]); 
    
    const {currentUser} = useUserStore();
    const {groupChatId, name, description, avatar, users} = useGroupChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"});
    }, [chat?.messages]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", groupChatId), (res) => {
            setChat(res.data());
        });
        users.forEach(async(user) => {
            onSnapshot(doc(db, "users", user), (res) => {
                members.push(res.data());
            })
        })

        return () => {
            unSub();
        }
    }, [groupChatId]);

    const handleEmoji = e => {
        setText(prev => prev + e.emoji);
        setOpen(false);
    }

    const handleImg = e => {
        if (e.target.files[0]) {
            if (!e.target.files[0].type.includes("image")){
                toast.error("It's not an Image!");
                return;
            }
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleFile = async(e) => {
        if (e.target.files[0]) {
            if(e.target.files[0].size > 2000000) {
                toast.error("The file size is too big! (max 2mb)");
                return;
            }
            else if (e.target.files[0].type.includes("image")){
                toast.error("You tried to pass an Image!");
                return;
            }

            let fileUrl = null;
            
            try {

                if (e.target.files[0]) {
                    fileUrl = await upload(e.target.files[0], "files");
                }
    
                await updateDoc(doc(db, "chats", groupChatId), {
                    messages: arrayUnion({
                        senderId: currentUser.id,
                        text: "file",
                        createdAt: new Date(),
                        ...(fileUrl && {file: fileUrl, fileName: e.target.files[0].name})
                    })
                })
    
                const userIDs = [currentUser.id, users].flat();
    
                userIDs.forEach(async (id) => {
        
                    const userChatsRef = doc(db, "userchats", id);
                    const userChatsSnapshot = await getDoc(userChatsRef);
        
                    if (userChatsSnapshot.exists()) {
                        const userChatsData = userChatsSnapshot.data();
                        
                        const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === groupChatId);
                        userChatsData.chats[chatIndex].lastMessage = "file";
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                        userChatsData.chats[chatIndex].updatedAt = Date.now();
                        
                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats
                        })
                    }
                })
                
            } catch (err) {
                console.log(err);
            }
        }
    }

    const handleSend = async(e = null) => {
        e.preventDefault();
        if (text === "") return;

        let imgUrl = null;

        try {

            if (img.file) {
                imgUrl = await upload(img.file, "images");
            }

            await updateDoc(doc(db, "chats", groupChatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && {img: imgUrl, imgName: img.file.name})
                })
            })

            const userIDs = [currentUser.id, users].flat();

            userIDs.forEach(async (id) => {
    
                const userGroupChatsRef = doc(db, "usergroupchats", id);
                const userGroupChatsSnapshot = await getDoc(userGroupChatsRef);
    
                if (userGroupChatsSnapshot.exists()) {
                    const userChatsData = userGroupChatsSnapshot.data();
                    
                    const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === groupChatId);
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();
                    
                    await updateDoc(userGroupChatsRef, {
                        chats: userChatsData.chats
                    })
                }
            })
            
        } catch (err) {
            console.log(err);
        } finally {
            setImg({
                file: null,
                url: ""
            });
    
    
            setText("");
        }


    }

    let groupDescription = [...description];
    if (groupDescription.length > 30) {
        groupDescription = [groupDescription.splice(0, 27), ".", ".", "."];
    }

    return (
        <div className="chat">
            <div className="top">
                <img src="./menu.png" alt="menu" id="menu" onClick={props.changeList}/>
                <div className="user">
                    <img src={avatar || "./avatar.png"} alt="avatar" />
                    <div className="texts">
                        <span>{name}</span>
                        <p>{groupDescription}</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="call" className="not-avaible"/>
                    <img src="./info.png" alt="info" onClick={props.changeGroupDetail}/>
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message) => {
                  return <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
                    {message?.senderId === currentUser.id ? "" :<img src={members.filter((member) => member.id === message?.senderId)[0].avatar} alt="avatar" />}
                    <div className="texts">
                        {message.img && <img src={message.img} alt="image"></img>}
                        <p>
                            {message?.file ? <a href={message.file} target="_blank">{message.fileName}</a> : message.text}
                        </p>
                        <div className="info">
                            <span>{timeConverter(message.createdAt)}</span>
                            {message?.senderId === currentUser.id ? "" :<span>{members.filter((member) => member.id === message?.senderId)[0].username}</span>}
                        </div>
                    </div>
                    </div>})  
                    }
                {img.url && <div className="message own">
                    <div className="texts">
                        <img src={img.url} alt=""></img>
                    </div>
                    </div>}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="image">
                        <img src="./img.png" alt="image" />
                    </label>
                    <input type="file" id="image" style={{display: "none"}} onChange={handleImg}/>
                    <label htmlFor="file">
                        <img src="./file.png" alt="file" />
                    </label>
                    <input type="file" id="file" style={{display: "none"}} onChange={handleFile} />
                    <img src="./mic.png" alt="microphone" />
                </div>
                <form onSubmit={handleSend}>
                    <input type="text" placeholder={img.file ? "Label an image...": "Type a message..."} value={text} onChange={e => setText(e.target.value)} />
                </form>
                <div className="emoji">
                    <img src="./emoji.png" alt="emoji" onClick={() => setOpen((prev) => !prev)}/>
                    <div className="picker">
                        <EmojiPicker open={open} theme="dark" onEmojiClick={handleEmoji} width="200" autoFocusSearch={false}/>
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend} >Send</button>
            </div>
        </div>
    )
}

export default ChatGroup