import { useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import Edit from "./edit/Edit";
import "./userInfo.css"

const Userinfo = () => {
    const [editMode, setEditMode] = useState(false); 
    const {currentUser} = useUserStore();

    const handleEdit = () => {
        setEditMode(prev => !prev);
    }
    return (
        <div className="userInfo">
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt="avatar" />
                <h2 style={currentUser.username.length > 10 ? {fontSize: "22px"} : {}}>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="more" className="not-avaible"/>
                <img src="./edit.png" alt="edit" onClick={handleEdit}/>
            </div>
            {editMode && <Edit changeEdit={handleEdit}/>}
        </div>
    )
}

export default Userinfo