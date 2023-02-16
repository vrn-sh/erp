import { Link } from 'react-router-dom';
import "./SideBar.scss"
import { SideBarData } from './SideBarData';
import SubMenu from './SubMenu';

export default function SideBar() {
    return (
        <>
            <div className='top-bar'>
                <Link to="#">
                    <h1 className='site-title'>voron</h1>
                </Link>
            </div>
            <div className='sidebar'>
                <div className='sidebar-container'>
                    {SideBarData.map((item, index) => {
                        return <SubMenu item={item} key={index} />
                    })}
                </div>
            </div>
        </>
    )
}