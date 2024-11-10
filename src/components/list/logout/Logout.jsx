import { auth } from "../../../lib/firebase"
import "./logout.css"

const Logout = () => {
    return (
        <div className="logout">
            <button  onClick={() => auth.signOut()}>Logout</button>
        </div>
    )
}

export default Logout