import NavBar from "../../component/NavBar"
import Footer from "../../component/Footer"
import "./Home.scss"

export default function Home() {
    return (
        <>
            <NavBar />
            <section className="home-container">
                <div id="home" className="home">
                    <h1>Home</h1>
                </div>
                <div id="about" className="about">
                    <h1>About</h1>
                </div>
                <div id="team" className="team">
                    <h1>Team</h1>
                </div>
            </section>
            <Footer />
        </>
    )
}