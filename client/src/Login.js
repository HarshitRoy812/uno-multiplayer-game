import React,{useState} from 'react';
import './Login.css';
import logo from './imgs/logo.png';

function Login()
{

    const [isLogin,setIsLogin] = useState(true);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [message,setMessage] = useState("");
    const [loading,setLoading] = useState(false);
    const [isErr,setIsErr] = useState(false);


    const switchMode = (isLoginMode) => 
    {
        setIsLogin(isLoginMode);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setMessage("");
    }

    const handleRegister = async (e) => 
    {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsErr(false);

        if (password !== confirmPassword)
        {
            setLoading(false);
            setIsErr(true);
            return setMessage("Passwords do not match!");
        }

        try 
        {
            const response = await fetch('http://localhost:5000/api/register', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({name,email,password})
            });
            
            const data = await response.json();

            if (!data.ok)
            {
                setIsErr(true);
                return setMessage(data.error || "Registration failed.");
            }

            setMessage("Registration successful! You can now log in.");
            switchMode(true);            
        }
        catch (error)
        {
            setIsErr(true);
            setMessage("An error occurred. Please try again.");
        }
        finally 
        {
            setLoading(false);
        }
    }

    const handleLogin = async (e) => 
    {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setIsErr(false);


        try 
        {
            const response = await fetch('http://localhost:5000/api/login', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({email,password}),
            })

            const data = await response.json();

            if (!data.ok)
            {
                setIsErr(true);
                return setMessage(data.error || 'Login failed!')
            }   

            setMessage("Login successful! Redirecting...");
        }
        catch (error)
        {
            setIsErr(true);
            setMessage("An error occurred. Please try again.")
        }
        finally 
        {
            setLoading(false);
        }
    }

    return (
        
        <div className = 'page'>
            
            <div className = 'wrapper'>

                <div className = 'top'>

                    <img src = {logo} className = 'logo' alt = "Logo"/>

                </div>

                <div className = 'card'>

                    { isLogin && 
                    <>

                    <form onSubmit = {handleLogin}>
                        <div className = 'inputRow'>
                            <span className = 'icon'> 📧 </span>
                            <input className = 'input' placeholder = 'Email' type = 'email' value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className = 'inputRow'>
                            <span className = 'icon'> 🔒 </span>
                            <input className = 'input' placeholder = 'Password' type="password" value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                        </div> 
                        
                        <button type = 'submit' disabled = {loading} className = 'loginButton'> {loading ? "Logging In..." : "Login"} </button>

                        <p className = 'signupText'> Don't have an account? <a className = 'signupLink' onClick = {() => switchMode(false)}> Sign Up </a> </p>
                    </form>

                    {message && (
                        <p className = {isErr ? 'msg_error' : 'msg'}> {message} </p>
                    )}
                    
                    </>}

                    { !isLogin && 
                    <>
                    <form onSubmit = {handleRegister}>
                        <div className = 'inputRow'>
                            <span className = 'icon'> 👤 </span>
                            <input className = 'input' placeholder = 'Name' type = 'text' value = {name} onChange = {(e) => setName(e.target.value)}/>
                        </div>

                        <div className = 'inputRow'>
                            <span className = 'icon'> 📧 </span>
                            <input className = 'input' placeholder = 'Email' type="email" value = {email} onChange = {(e) => setEmail(e.target.value)}/>
                        </div>

                        <div className = 'inputRow'>
                            <span className = 'icon'> 🔒 </span>
                            <input className = 'input' placeholder = 'Password' type = 'password' value = {password} onChange = {(e) => setPassword(e.target.value)}/>
                        </div>

                        <div className = 'inputRow'>
                            <span className = 'icon'> 🔒 </span>
                            <input className = 'input' placeholder = 'Confirm Password' type="password" value = {confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)}/>
                        </div>

                        <button type = 'submit' disabled = {loading} className = 'registerButton'> {loading ? "Registering..." : "Register"} </button>

                        <p className = 'loginText'> Already have an account? <a className = 'loginLink' onClick = {() => switchMode(true)}> Login here </a> </p>
                    </form>

                    {message && (
                        <p className = {isErr ? 'msg_error' : 'msg'}> {message} </p>
                    )}
                    
                    </>}

                    

                </div>

                <div className = 'bottom'>

                    <p className = 'tagline'> Play UNO with your friends online! </p>

                </div>

            </div>

        </div>
    )
}

export default Login;