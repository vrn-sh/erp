import "./signup.scss";
import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const Regex = RegExp(/^\s?[A-Z0-9]+[A-Z0-9._+-]{0,}@[A-Z0-9._+-]+\.[A-Z0-9]{2,4}\s?$/i);

interface SignUpProps {
  name?: any;
  value?: any;
}

interface SignUpState {
  email: string;
  password: string;
  confirmpassword: string;
  errors: {
    email: string;
    password: string;
    confirmpassword: string;
  };
}

export const SignUp: React.FC<SignUpProps> = () => {

  const [state, setState] = useState<SignUpState>({
    email: '',
    password: '',
    confirmpassword: '',
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
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        // Créez un objet pour stocker les données du formulaire 
        const formData = {
          email: state.email,
          password: state.password,
          confirmPassword: state.confirmpassword
        };
      
        // Envoyer une requête POST pour envoyer les données du formulaire à l'API
        try {
          const response = await fetch('', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
      
          if (response.ok) {
            //console.log('Formulaire envoyé avec succès à l\'API');
          } else {
            //console.error('Une erreur est survenue lors de l\'envoi du formulaire à l\'API');
          }
        } catch (error) {
          //console.error('Une erreur est survenue lors de l\'envoi du formulaire à l\'API:', error);
        }
      };
      
      const [showPassword, setShowPassword] = useState(false);
      const [showconfirmpassword, setShowConfirmpassword] = useState(false);

      const handleShowPassword = () => {
        setShowPassword(!showPassword);
      };

      const handleShowconfirmPassword = () => {
        setShowConfirmpassword(!showconfirmpassword);
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
          <div className='wrapper-log'>
            <div className='form-wrapper-log'>
             

                            <span className="welcom"><h2>Welcome to voron</h2></span>
                            <form onSubmit={handleSubmit} noValidate >
                                
                                <div className='input-block'>
                                    <label className="placeholder" htmlFor="email">Email Address</label>
                                    <input type='email' name='email' onChange={handleChange}/>
                                    {errors.email.length > 0 &&  <span style={{color: "red"}}>{errors.email}</span>}
                                </div>
                                <div className='input-block'>
                                    <label className="placeholder" htmlFor="password">Password</label>
                                    <input type={showPassword ? 'text' : 'password'} name="password" id="password" onChange={handleChange}/>
                                    {errors.password.length > 0 &&  <span style={{color: "red"}}>{errors.password}</span>}
                                    <Icon className="i" icon={showPassword ? eye : eyeOff} onClick={handleShowPassword} />
                                </div>   
                                <div className='input-block'>
                                    <label className="placeholder" htmlFor="Confirmpassword">Confirm Password</label>
                                    <input type={showconfirmpassword ? "text" : "password"} name='confirmpassword' onChange={handleChange}/>
                                    {errors.confirmpassword.length > 0 &&  <span style={{color: "red"}}>{errors.confirmpassword}</span>}
                                    <Icon className="i" icon={showconfirmpassword ? eye : eyeOff} onClick={handleShowconfirmPassword} />
                                </div>              
                                <div className='submit'>
                                    <button className="button">SIGN UP</button>
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