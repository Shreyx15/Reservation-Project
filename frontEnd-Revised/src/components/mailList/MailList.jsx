import { useState } from 'react';
import './mailList.css';
import axios from 'axios';

const MailList = () => {
    const [email, setEmail] = useState("");
    const handleClick = async () => {
        try {
            const res = await axios.post(`${process.env.BACKEND_HOSTED_URL}/users/addSubscription`, { email: email });
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mail">
            <h1 className="mailTitle">Save time, save money!</h1>
            <span className="mailDesc">Sign up and we'll send the best deals to you</span>
            <div className="mailInputContainer">
                <input type="text" placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={handleClick}>Subscribe</button>
            </div>
        </div>
    );
};

export default MailList;