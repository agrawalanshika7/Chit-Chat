import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore"
import { useChatStore } from "../../lib/chatStore"
import { auth, db, storage } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore"
import "./detail.css"
import { useEffect, useState } from "react"
import { getDownloadURL, ref } from "firebase/storage"

const Detail = (props) => {
    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
    const {currentUser} = useUserStore();

    const [photos, setPhotos] = useState(false);
    const [filteredPhotos, setFilteredPhotos] = useState(null);
    const [files, setFiles] = useState(false);
    const [filteredFiles, setFilteredFiles] = useState(null);

    useEffect(() => {
        setPhotos(false);
        setFilteredPhotos(null);
        setFiles(false);
        setFilteredFiles(null);
    }, [chatId])

    const handleImgs = async() => {
        setPhotos(prev => !prev);

        const chatRef = doc(db, "chats", chatId);
        const chatSnapshot = await getDoc(chatRef);

        const chatData = chatSnapshot.data()

        setFilteredPhotos(chatData.messages.filter((c) => c.img));
    }

    const handleFiles = async() => {
        setFiles(prev => !prev);

        const chatRef = doc(db, "chats", chatId);
        const chatSnapshot = await getDoc(chatRef);

        const chatData = chatSnapshot.data()

        setFilteredFiles(chatData.messages.filter((c) => c.file));
    }

    const handleBlock = async() => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
            })
            changeBlock();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="avatar" />
                <h2>{user?.username}</h2>
                <p>{user?.desc}</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="ArrowUp" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="ArrowUp" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src={photos ? "./arrowDown.png" : "./arrowUp.png"} alt="ArrowDown" onClick={handleImgs}/>
                    </div>
                    <div className={photos ? "photos" : "photos disabled"}>
                        {filteredPhotos && filteredPhotos.map(message => {
                            return (<div className="photoItem">
                            <div className="photoDetail">
                                <img src={message.img} alt="image"/>
                                <span>{message.imgName}</span>
                            </div>
                            <a href={message.img} target="_blank" download={message.img}><img src="./download.png" alt="load" className="icon"/></a>
                        </div>)
                        })}
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src={files ? "./arrowDown.png" : "./arrowUp.png"} alt="ArrowUp" onClick={handleFiles}/>
                    </div>
                    <div className={files ? "files" : "files disabled"}>
                        {filteredFiles && filteredFiles.map(message => {
                            return (<div className="fileItem">
                            <div className="fileDetail">
                                <a href={message.file}>{message.fileName}</a>
                            </div>
                        </div>)
                        })}
                    </div>
                </div>
                <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User blocked" : "Block User"}</button>
                <button onClick={props.changeDetail} className="goBack">Go Back</button>
            </div>
        </div>
    )
}

export default Detail