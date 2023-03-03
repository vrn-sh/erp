import "../style/register.scss";
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

const Regex = RegExp(/^\s?[A-Z0-9]+[A-Z0-9._+-]{0,}@[A-Z0-9._+-]+\.[A-Z0-9]{2,4}\s?$/i);

interface SignUpProps {
  name?: any;
  value?: any;
}

interface SignUpState {
  email: string;
  password: string;
  Confirmpassword: string;
  errors: {
    email: string;
    password: string;
    confirmpassword: string;
  };
}

export const SignUp: React.FC<SignUpProps> = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmpasswordShown, setConfirmPasswordShown] = useState(false);

  const [state, setState] = useState<SignUpState>({
    email: '',
    password: '',
    Confirmpassword: '',
    errors: {
      email: '',
      password: '',
      confirmpassword: ''
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = state.errors;
        switch (name) {
        case 'email':
            errors.email = Regex.test(value) ? '' : 'Email is not valid!';
            break;
        case 'password':
            errors.password = value.length < 8 ? 'Password must be eight characters long!' : '';
            break;
        case 'confirmpassword':
            errors.confirmpassword = value !== state.password ? 'Password and Confirm Password does not match' : '';
            break;
        default:
            break;
        }
        setState({ ...state, errors, [name]: value });
        console.log(state.errors);
    }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let validity = true;
    Object.values(state.errors).forEach(
      (val) => val.length > 0 && (validity = false)
    );
    if (validity === true) {
      console.log("Registering can be done");
    } else {
      console.log("You cannot be registered!!!");
    }
  }

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  }

  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmpasswordShown ? false : true);
  }

  const { errors } = state;
  return (
    <>
      <section className="signup-container">
        <div className="signup-text" id="signup-text">
          <p className="text-box">
            <span className="alpha"><h1>voron</h1></span>
            <span className="betta"><h2>Lorem ipsum dolor sit amet consectet. Neque.</h2></span>
            <span className="charlie">Lorem ipsum dolor sit amet consectetur. Quis platea lectus.</span>
          </p>
        </div>
        <div className="signup-form" id="signup-form">
          <div className='wrapper'>
            <div className='form-wrapper'>
             

                            <span className="welcom"><h2>Welcome to voron</h2></span>
                            <form onSubmit={handleSubmit} noValidate >
                                
                                <div className='input-block'>
                                    <label className="placeholder" htmlFor="email">Email Address</label>
                                    <input type='email' name='email' onChange={handleChange}/>
                                    {errors.email.length > 0 &&  <span style={{color: "red"}}>{errors.email}</span>}
                                </div>
                                <div className='input-block'>
                                    <label className="placeholder" htmlFor="password">Password</label>
                                    <input type={passwordShown ? "text" : "password"} name='password' onChange={handleChange}/>
                                    {errors.password.length > 0 &&  <span style={{color: "red"}}>{errors.password}</span>}
                                    <i onClick={togglePasswordVisiblity}>{passwordShown ? eye : eyeSlash}</i>

                                </div>    
                                <div className='input-block'>
                                    <label className="placeholder" htmlFor="Confirmpassword">Confirm Password</label>
                                    <input type={confirmpasswordShown ? "text" : "password"} name='Confirmpassword' onChange={handleChange}/>
                                    {errors.password.length > 0 &&  <span style={{color: "red"}}>{errors.password}</span>}
                                    <i onClick={toggleConfirmPasswordVisiblity}>{confirmpasswordShown ? eye : eyeSlash}</i>
                                </div>              
                                <div className='submit'>
                                    <button>SIGN UP</button>
                                </div>
                                <div className="log-box">
                                    <span>Already have an account? </span>
                                    <span className="txt-color">Log in here!</span>
                                </div>
                            </form>
                        </div>
                     </div>
                </div>
            </section>
        </>
    )
}