import React from 'react';
import NavBar from '../../component/NavBar/NavBar';
import Footer from '../../component/Footer/Footer';
import './Home.scss';
import About from './About/About';
import Team from './Team/Team';
import Timeline from './Timeline/Timeline';

export default function Home() {
    return (
        <>
            <NavBar />
            <section>
                <div id="home" className="home">
                    <div className="loader">
                        <div className="home-container">
                            <h1>VORON</h1>
                            <h4>
                                In <span>efficiency</span> we trust.
                            </h4>
                        </div>
                    </div>
                </div>
                <About />
                <Timeline />
                <Team />
            </section>
            <Footer />
        </>
    );
}
