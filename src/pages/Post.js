import React,{useEffect,useState,useContext} from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';
import Axios from 'axios';

function Post() {
  let navigate=useNavigate();
    let {id}=useParams();
    const [postObject,setPostObject]=useState({});
    const [comments,setComments]=useState([]);
    const [newComment,setNewComment]=useState()
    // const [newTitle,setNewTitle]=useState("")
    const {authState}=useContext(AuthContext)
    useEffect(()=>{
      Axios.get(`http://localhost:3001/posts/byId/${id}`)
      .then((resp)=>{
        setPostObject(resp.data)
        // setNewTitle(postObject.title)
        // console.log(resp.data)
      });
      Axios.get(`http://localhost:3001/comments/${id}`,
      {headers:{accessToken:localStorage.getItem("accessToken")}
      })
      .then((resp)=>{
        setComments(resp.data)
      });
    },[]);
    const addComment=()=>{
      Axios.post("http://localhost:3001/comments",
      {commentBody:newComment,
      PostId:id},
      {
        headers:{
          accessToken:localStorage.getItem("accessToken"),
        }
      })
      .then((resp)=>{
        if(resp.data.error){
          alert("User not logged In");
        }
        else{
          // console.log("Comment created");
        const commentToAdd={commentBody:newComment,
          username:resp.data.username}
        setComments([...comments,commentToAdd])
        setNewComment("")
        }
      });
    }
    const deleteComment=(id)=>{
      Axios.delete(`http://localhost:3001/comments/${id}`)
      .then(()=>{
        setComments(comments.filter((val)=>{
          return val.id !== id;
        }))
      })
    }

    const deletePost=(id)=>{
      Axios.delete(`http://localhost:3001/posts/${id}`,
      {headers:{accessToken:localStorage.getItem('accessToken')}
    })
      .then((resp)=>{
        // console.log(resp)
        navigate("/");
      })
    }

    const editPost=(option)=>{
      if(option==="title"){
        let newTitle=prompt("Enter new Title:");
        Axios.put("http://localhost:3001/posts/title",
        {newTitle:newTitle,id:id},
        {headers:{accessToken:localStorage.getItem('accessToken')}
      })
        .then((resp)=>{
          setPostObject({...postObject,title:resp.data})
          console.log(resp.data);
        })
      }
      else{
        let newBody=prompt("Enter new Text:");
        Axios.put("http://localhost:3001/posts/body",
        {newBody:newBody,id:id},
        {headers:{accessToken:localStorage.getItem('accessToken')}
      })
        .then((resp)=>{
          console.log(resp.data);
          setPostObject({...postObject,postText:resp.data})
        })
      }
    }
  return (
    <div className='postPage'>
        <div className='leftSide'>
          <div className='post' id='individual'>
          <div className='title'
            onClick={()=>{
              if(authState.username===postObject.username){
                editPost("title");
              }
            }}
          >
            {postObject.title}
            </div>
          <div className='body'
            onClick={()=>{
              if(authState.username===postObject.username){
                editPost("body")
              }
            }}
          >
            {postObject.postText}
            </div>
          <div className='footer'>{postObject.username}
          {
            authState.username===postObject.username &&
            (
            <button onClick={()=>{deletePost(postObject.id)}}>
              Delete Post
            </button>
            )
          }
          </div>
          </div>
        </div>
        <div className='rightSide'>
          <div className='addCommentContainer'>
            <input type="text" 
            placeholder='Comment' 
            autoCapitalize='off'
            value={newComment}
            onChange={(e)=>{
              setNewComment(e.target.value)
            }}/>
            <button onClick={addComment}>Add comment</button>
          </div>
          <div className='listOfComments'>
              {comments.map((comment)=>{
                return <div className='comment'>
                  {comment.commentBody}
                  <label>
                    Username:{comment.username}
                  </label>
                  {
                    authState.username===comment.username &&
                    (<button onClick=
                      {()=>{deleteComment(comment.id)}}>
                      X
                      </button>)
                  }
                  </div>
              })}
          </div>
        </div>
    </div>
  )
}

export default Post