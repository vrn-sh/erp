import NavBar from "../../component/NavBar/NavBar"
import Footer from "../../component/Footer/Footer"
import "./Home.scss"
import About from "./About/About"
import Team from "./Team/Team"

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

                <About />
                <Team />
            </section>
            <Footer />
        </>
    )
}