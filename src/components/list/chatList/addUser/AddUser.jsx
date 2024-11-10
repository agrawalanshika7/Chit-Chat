import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css"
import { useState } from "react";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = (props) => {
    const [user, setUser] = useState(null);

    const {currentUser} = useUserStore();

    const handleSearch = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get("username");

        if (currentUser.username === username) return;

        try {
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username))

            const querySnapShot = await getDocs(q);

            if(!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleAdd = async() => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);
            
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                })
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                })
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="addUser">
            <img src="./close.png" alt="close" className="close" onClick={props.changeAddMode}/>
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="userDetail">
                    <img src={user.avatar || "./avatar.png"} alt="avatar" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}

export default AddUser;