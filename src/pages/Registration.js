import React from 'react'
import {Formik,Form,Field,ErrorMessage} from 'formik'
import * as Yup from 'yup';
import Axios from 'axios';

function Registration() {
    const initialValues={
        username:"",
        password:"",
    }
    const validationSchema = Yup.object().shape({
        username:Yup.string().min(3).max(15).required(),
        password:Yup.string().min(4).max(20).required(),
    })
    const onSubmit =(data)=>{
        Axios.post("http://localhost:3001/auth",data)
        .then(()=>{
            alert("Registration Completed")
            console.log(data);
        });
    };
  return (
    <div>
        <h1>Registration</h1>
        <Formik initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}>
            <Form className='formContainer'>
                <label>Username:</label>
                <ErrorMessage name='username' component="span"/>
                <Field 
                autoComplete="off"
                id="inputCreatePost" 
                name="username"
                placeholder="(Ex. Arshath...)" 
                />
                <label>Password:</label>
                <ErrorMessage name='password' component="span"/>
                <Field 
                autoComplete="off"
                type="password"
                id="inputCreatePost" 
                name="password"
                placeholder="Password.." 
                />
                <button type='submit'>
                    Register
                </button>
            </Form>
        </Formik>
    </div>
  )
}

export default Registration;