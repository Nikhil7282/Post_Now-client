import React ,{useContext,useEffect}from 'react'
import Axios from 'axios'
import {Formik,Form,Field,ErrorMessage} from 'formik'
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from "../helpers/AuthContext"
function CreatePost() {
    const navigate=useNavigate();
    const {authState}=useContext(AuthContext)

    useEffect(()=>{
        if(!localStorage.getItem("accessToken")){
            navigate('/login')
        }
    },[])

    const initialValues={
        title:"",
        postText:"",
    }
    const onSubmit=(data)=>{

        Axios.post("http://localhost:3001/posts",data,
        {headers:{accessToken:localStorage.getItem("accessToken")}})
        .then((resp)=>{
            alert("Post Uploaded")
            navigate('/')
        })

    }

    const validationSchema = Yup.object().shape({
        title:Yup.string().required("You must mention title"),
        postText:Yup.string().required(),
    })

  return (
    <div className='createPostPage'>
        <Formik initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
            <Form className='formContainer'>
                <label>Title</label>
                <ErrorMessage name='title' component="span"/>
                <Field 
                autoComplete="off"
                id="inputCreatePost" 
                name="title"
                placeholder="(Ex. Title)" 
                />
                <label>Post:</label>
                <ErrorMessage name='postText' component="span"/>
                <Field
                autoComplete="off" 
                id="inputCreatePost" 
                name="postText"
                placeholder="(Ex. Post...)" 
                />
                <button type='submit'>
                    Create Post
                </button>
            </Form>
        </Formik>
    </div>
  )
}

export default CreatePost