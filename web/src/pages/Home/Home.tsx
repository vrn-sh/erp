import NavBar from "../../component/NavBar/NavBar"
import Footer from "../../component/Footer/Footer"
import "./Home.scss"

export default function Home() {
    return (
        <>
            <NavBar />
            <section>

                <div id="home" className="home">
                    <div className="loader">
                        <div className="home-container">
                            <h1>VORON</h1>
                            <h4>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h4>
                        </div>
                    </div>
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