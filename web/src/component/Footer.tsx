import "../main.scss"

export default function Footer() {
    return (
        <div className="footer">
            <h2 className="site-title">voron</h2>
            <p>Copyright ©2023 VORON, Inc.</p>
            <p>Contact voron@djnn.sh</p>
            <div className="policy-link">
                <ul>
                    <CustomLink to="/">Legal Stuff</CustomLink>
                    <CustomLink to="/">Privacy Policy</CustomLink>
                    <CustomLink to="/">TeSecurityam</CustomLink>
                </ul>
            </div>
        </div>
    )
}

function CustomLink({ to, children, ...props }: {to: string; children: string}) {
    return (
        <li>
            <a href={to} {...props}>
                {children}
            </a>
        </li>
    ) 
}