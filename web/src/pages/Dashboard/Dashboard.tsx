import SideBar from "../../component/SideBar/SideBar";
import TopBar from "../../component/SideBar/TopBar";
import "./Dashboard.scss"

export default function Dashboard() {
    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="dashboard-pages">
                    <p>AHAHA</p>
                    <button>.</button>
                </div>
            </div>
        </div>
    )
}