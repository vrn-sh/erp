import React from "react"
import "../main.scss"

const Footer = () => {
    return (
        <div className="footer">
            <h2 className="site-title">voron</h2>
            <p>Copyright ©2023 VORON, Inc.</p>
            <p>Contact voron@djnn.sh</p>
            <div className="policy-link">
                <ul>
                    <li>
                        <a>Legal Stuff</a>
                    </li>
                    <li>
                        <a href="/">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="/">Security</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Footer