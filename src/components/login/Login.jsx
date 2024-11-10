import { useEffect, useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    })

    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(true);
    
    const [usernameText, setUsernameText] = useState("");
    const [password, setPassword] = useState("");

    const [usernameFocus, setUsernameFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const tempFocusInOnUser = window.addEventListener("focusin", (e) => {
        if (e.target.getAttribute("id") === "usernameInput") {
            return setUsernameFocus(true);
        }

        if (e.target.getAttribute("id") === "passwordInput") {
            return setPasswordFocus(true);
        }
    })

    const tempFocusOutOnUser = window.addEventListener("focusout", (e) => {
        if (e.target.getAttribute("id") === "usernameInput") {
            return setUsernameFocus(false);
        }

        if (e.target.getAttribute("id") === "passwordInput") {
            return setPasswordFocus(false);
        }
    })

    const handleTypeChange = (e) => {
        if (e.target.innerHTML === "Login") {
            document.getElementsByClassName('background')[0].classList.remove('register');
            return setLogin(true)
        }
        else {
            document.getElementsByClassName('background')[0].classList.add('register');
            return setLogin(false);
        }
    }

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        
        const {username, email, password} = Object.fromEntries(formData);
        if (usernameText.length < 3 || usernameText.length > 15 || password.length < 6 || avatar.file === null)  {
            setLoading(false);
            return toast.warning("Something's missing...");
        }

        try {

            const res = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = await upload(avatar.file, "images");

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                desc: "Default",
                id: res.user.uid,
                blocked: []
            })

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
            })

            await setDoc(doc(db, "usergroupchats", res.user.uid), {
                chats: []
            })
            
            toast.success("Account created! You can login now!");
            
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);
        
        try {
            await signInWithEmailAndPassword(auth, email, password)
            removeEventListener("focusin", tempFocusInOnUser);
            removeEventListener("focusout", tempFocusOutOnUser);
        } catch(err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <div className="typeContainer">
                <button onClick={handleTypeChange}>Login</button>
                <button onClick={handleTypeChange}>Registration</button>
                <div className="background"></div>
            </div>
            {login && <div className="item">
                <h2>Welcome back, </h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" name="email"/>
                    <input type="password" placeholder="Password" name="password"/>
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>}
            {!login && <div className="item">
            <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="avatar" />
                        Upload an image</label>
                    <input type="file" id="file" style={{display: "none"}} onChange={handleAvatar}/>
                    <input 
                        type="text" 
                        placeholder="Username"
                        value={usernameText} 
                        name="username"
                        id="usernameInput" 
                        minLength="3" 
                        maxLength="15" 
                        onChange={(e) => setUsernameText(e.target.value)}/>
                    <ul id="usernameList" style={usernameFocus ? {display: "block"} : {}}>
                        <li className={usernameText.length >= 3 ? "right" : ""}>Minimum 3 characters</li>
                        <li className={usernameText.length <= 15 ? "right" : ""}>Maximum 15 characters</li>
                    </ul>
                    <input type="email" placeholder="Email" name="email"/>
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={password} 
                        name="password"
                        id="passwordInput" 
                        minLength="6"
                        onChange={(e) => setPassword(e.target.value)}/>
                    <ul id="passwordList" style={passwordFocus ? {display: "block"} : {}}>
                        <li className={password.length >= 6 ? "right" : ""}>Minimum 6 characters</li>
                    </ul>
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>}
        </div>
    )
}

export default Login;