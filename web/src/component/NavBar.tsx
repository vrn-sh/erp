import { Button } from "@mui/material";
import { Link, useResolvedPath, useMatch } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="nav">
            <Link to="/" className="site-title">voron</Link>
            <ul>
                <div className="nav-left">
                    <CustomLink to="/">Home</CustomLink>
                    <CustomLink to="/About">About</CustomLink>
                    <CustomLink to="/Team">Team</CustomLink>
                    <CustomLink to="/Contact">Contact</CustomLink>
                </div>
                <div className="nav-right">
                    <CustomLink to="/signup">Sign up</CustomLink>
                    <li className="login">
                        <Link to="/Login">
                            Log in
                        </Link>
                    </li>
                </div>
            </ul>
        </nav>
    )
}

function CustomLink({ to, children, ...props }: {to: string; children: string}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    ) 
}