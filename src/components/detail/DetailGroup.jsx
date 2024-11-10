import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { useGroupChatStore } from "../../lib/groupChatStore"
import { auth, db, storage } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore"
import "./detail.css"
import { useEffect, useState } from "react"
import { getDownloadURL, ref } from "firebase/storage"

const DetailGroup = (props) => {
    const {groupChatId, name, description, avatar, users} = useGroupChatStore();
    const {currentUser} = useUserStore();

    const [members, setMembers] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [photos, setPhotos] = useState(false);
    const [filteredPhotos, setFilteredPhotos] = useState(null);
    const [files, setFiles] = useState(false);
    const [filteredFiles, setFilteredFiles] = useState(null);

    useEffect(() => {
        setPhotos(false);
        setFilteredPhotos(null);
        setFiles(false);
        setFilteredFiles(null);
        users.forEach(async(user) => {
            const userRef = doc(db, "users", user);
            const userSnapshot = await getDoc(userRef);

            const userData = userSnapshot.data();

            setFilteredMembers(prev => [...prev, userData].flat())
        })
    }, [groupChatId])

    const handleMembers = () => {
        setMembers(prev => !prev);
    }

    const handleImgs = async() => {
        setPhotos(prev => !prev);

        const chatRef = doc(db, "chats", groupChatId);
        const chatSnapshot = await getDoc(chatRef);

        const chatData = chatSnapshot.data()

        setFilteredPhotos(chatData.messages.filter((c) => c.img));
    }

    const handleFiles = async() => {
        setFiles(prev => !prev);

        const chatRef = doc(db, "chats", groupChatId);
        const chatSnapshot = await getDoc(chatRef);

        const chatData = chatSnapshot.data()

        setFilteredFiles(chatData.messages.filter((c) => c.file));
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={avatar || "./avatar.png"} alt="avatar" />
                <h2>{name}</h2>
                <p>{description}</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Members</span>
                        <img src={members ? "./arrowDown.png" : "./arrowUp.png"} alt="ArrowUp" onClick={handleMembers}/>
                    </div>
                    <div className={members ? "members" : "members disabled"}>
                        {filteredMembers && filteredMembers.map((member) => {
                            return (
                                <div className="memberItem">
                                    <img src={member.avatar} alt="avatar" />
                                    <span>{member.username}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
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
                <button onClick={props.changeGroupDetail} className="goBack">Go Back</button>
            </div>
        </div>
    )
}

export default DetailGroup