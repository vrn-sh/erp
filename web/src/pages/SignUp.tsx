import "../style/register.scss"
import Footer from "../component/Footer"
import { fontStyle } from "@mui/system"

export default function SignUp() {
    const handleChange = (event : any) => {}
    const handleSubmit = (event : any) => {}
    return (
        <>
            <section className="signup-container">
                <div className="signup-text" id="signup-text">
                    <p>
                        <span><h1>voron</h1></span>
                        <span><h2>Lorem ipsum dolor sit amet consectet. Neque.</h2></span>
                        <span className="no-bold">Lorem ipsum dolor sit amet consectetur. Quis platea lectus.</span>
                    </p>
                </div>
                <div className="signup-form" id="signup-form">
                    <div className='wrapper'>
                        <div className='form-wrapper'>
                            <h2>Welcome to voron</h2>
                            <form onSubmit={handleSubmit} noValidate >
                                <div className='username'>
                                    <label htmlFor="username">Full Name</label>
                                    <input type='text' name='username' onChange={handleChange}/>
                                </div>
                                <div className='email'>
                                    <label htmlFor="email">Email</label>
                                    <input type='email' name='email' onChange={handleChange}/>
                                </div>
                                <div className='password'>
                                    <label htmlFor="password">Password</label>
                                    <input type='password' name='password' onChange={handleChange}/>
                                </div>              
                                <div className='submit'>
                                    <button>Register Me</button>
                                </div>
                            </form>
                        </div>
                     </div>
                </div>
            </section>
        </>
    )
}