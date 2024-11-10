import "./chat.css"

const ChatDefault = (props) => {
    return (
        <div className="chat">
            <div className="top">
                <img src="./menu.png" alt="menu" id="menu" onClick={props.changeList}/>
                <div className="user">
                    <img src="./avatar.png" alt="avatar" />
                    <div className="texts">
                        <span>Select User</span>
                        <p></p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="call" className="not-avaible"/>
                    <img src="./video.png" alt="call" className="not-avaible"/>
                    <img src="./info.png" alt="info"/>
                </div>
            </div>
            <div className="center">
                <div className="defaultMessage">Please selact a Chat...</div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="image">
                        <img src="./img.png" alt="image" />
                    </label>
                    <input type="file" id="image" style={{display: "none"}}  disabled/>
                    <label htmlFor="file">
                        <img src="./file.png" alt="file" />
                    </label>
                    <input type="file" id="file" style={{display: "none"}} disabled />
                    <img src="./mic.png" alt="microphone" />
                </div>
                <form>
                    <input type="text" placeholder="Type a message..." disabled/>
                </form>
                <div className="emoji">
                    <img src="./emoji.png" alt="emoji" />
                </div>
                <button className="sendButton" disabled>Send</button>
            </div>
        </div>
    )
}

export default ChatDefault