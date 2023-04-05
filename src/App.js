import './App.css';
import {BrowserRouter as Router,Route,Routes,Link} from 'react-router-dom'
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import  {AuthContext} from './helpers/AuthContext';
import { useState,useEffect } from 'react';
import  axios  from 'axios';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';


function App() {
  const [authState,setAuthState]=useState({
    username:"",
    id:0,
    status:false,
  });


  useEffect(()=>{
    // console.log(authState)
      axios.get("http://localhost:3001/auth/auth,",{
        headers:{
          accessToken:localStorage.getItem("accessToken")
        },
      })
      .then((resp)=>{
        if(!localStorage.getItem("accessToken")){
          setAuthState({...authState,status:false});
        }
        else{
          if(localStorage.getItem("accessToken")){
            setAuthState({
              username:resp.data.username,
              id:resp.data.id,
              status:true,
            });
          }
          // loading.username=resp.data.username;
        }
        console.log(authState.status)
      });
  },[]);

  const logout=()=>{
    localStorage.removeItem("accessToken");
    setAuthState(
    {username:"",
    id:0,
    status:false,
  });
  }

  return (
    <div className="App">
    <AuthContext.Provider value={{authState,setAuthState}}>
    <Router>
      <div className='navbar'>
      <div className='links'>
      {!authState.status ?(
      <>
      {/* {console.log(authState.status)} */}
      <Link to="/login">Login</Link>
      <Link to="/registration">Registration</Link>
      </>
      ):(
        <>
      <Link to="/createpost">Add new post</Link>
      <Link to="/">Home Page</Link>
        </>
      )}
      </div>
      <div className='loggedInContainer'>
      {authState.status &&
      <>
      <h1>
      {/* <Link to={`/profile/${authState.id}`}> */}
        {authState.username}
      {/* </Link> */}
        </h1>
      <button onClick={logout}>
      Logout</button>
      </> 
      }
      </div>
      </div>
      <Routes className="routes">
        <Route path='/' element={<Home/>}/>
        <Route path='/createpost' element={<CreatePost/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </Router>
    </AuthContext.Provider>
    </div>
  );
}

export default App;
