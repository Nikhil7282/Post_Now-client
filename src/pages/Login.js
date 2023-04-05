import React,{useState,useContext} from 'react'
import Axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {AuthContext} from "../helpers/AuthContext"
function Login() {
    
    const navigate=useNavigate();
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const {setAuthState}=useContext(AuthContext)
    const login=()=>{
        const data={
            username:username,
            password:password
        }
        Axios.post('http://localhost:3001/auth/login',data)
        .then((resp)=>{
            if(resp.data.error){
                alert(resp.data.error);
            }
            else{
                localStorage.setItem("accessToken",resp.data.token);
                setAuthState({username:resp.data.username,
                id:0,
                status:true
            })
                navigate('/');
            }
        })
    }
  return (
    <div className='loginContainer'>
        <h1>Login</h1>
        <input 
        placeholder='username'
        type="text"
        onChange={(e)=>{setUsername(e.target.value)}}
        />
        <input
        placeholder='password'
        type="password"
        onChange={(e)=>{setPassword(e.target.value)}}
        />
        <button onClick={login}>Login</button>
    </div>
  )
}

export default Login