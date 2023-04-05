import React from 'react'
import  Axios from "axios";
import {useEffect,useState,useContext} from "react";
import { Link, useNavigate } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import {AuthContext} from "../helpers/AuthContext"

function Home() {
    const [listOfPosts,setListOfPosts]=useState([]);
    const [likedPosts,setLikedPosts]=useState([]);
    const {authState} =useContext(AuthContext)
    let navigate=useNavigate()

    useEffect(()=>{
      if(!localStorage.getItem("accessToken")){
        navigate('/login');
      }
      else{
        Axios.get("http://localhost:3001/posts",{
        headers:{accessToken:localStorage.getItem("accessToken")}
      })
        .then((resp)=>{
          setListOfPosts(resp.data.listOfPosts);
          setLikedPosts(resp.data.likedPosts.map((like)=>{
              // console.log(like.PostId)
              return like.PostId;
           }));
          //  console.log(likedPosts)
        })
      }
        
      },[]);

      const likePost=(postId)=>{
        // console.log("like button clicked");
        Axios.post("http://localhost:3001/likes",
        {PostId:postId},
        {headers:{accessToken:localStorage.getItem("accessToken")}}
        )
        .then((resp)=>{
          setListOfPosts(listOfPosts.map((post)=>{
            // console.log("id:"+post)
            if(post.id===postId){
              if(resp.data.liked){
                // console.log("liked:"+post);
                return {...post,Likes:[...post.Likes,"some random value"]};
              }
              else{
              const likesArray=post.Likes
              likesArray.pop()
              return {...post,Likes:likesArray};
              }
            }else{
              return post;
            }
          }))
          // console.log(likedPosts)
          if(likedPosts.includes(postId)){
            setLikedPosts(likedPosts.filter((id)=>{
              return id !== postId;
            }));
          }else{
            setLikedPosts([...likedPosts,postId])
          }
        })
      }

  return (
    <div>
        {listOfPosts.map((value,key)=>{
        return(
        <div key={key} className='post'>
          <div className='title'>{value.title}</div>
          <div 
          className='body'
          onClick={()=>{
          navigate(`/post/${value.id}`)}}>
          {value.postText}
          </div>
          <div className='footer'>
            <div className='username'>
              <Link to={`/profile/${value.UserId}`}>
              {value.username}
              </Link>
              </div>
            <div className='buttons'>
            <ThumbUpAltIcon
            onClick={()=>{likePost(value.id);
            }}
            className={likedPosts.includes(value.id)?"unlikeBttn"
          :"likeBttn"}
            />
            <label>{value.Likes.length}</label>
            </div>
          </div>
        </div>)
      })}
    </div>
  )
}

export default Home;