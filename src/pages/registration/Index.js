import React, { useState } from 'react'
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Images from '../../components/Images'
import Input from '../../components/Input'
import Peragraph from '../../components/Peragraph'
import Title from '../../components/Title'
import Button from '../../components/Button'
import Authentication from '../../components/Authentication'
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import Alert from '@mui/material/Alert';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Puff } from  'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { getDatabase, set, ref, push } from "firebase/database";
import "../login/style.css"

const Index = () => {

    <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
    />

    const database = getDatabase();
    const auth = getAuth();
    let navigate = useNavigate()
    let [showPass, setShowPass] = useState(false);
    let [showCPass, setShowCPass] = useState(false);
    let [loader, setLoader] = useState(false);

    let [FormData, setFormData] = useState({
        email: "",
        full_name: "",
        password: "",
        c_password: "",
    })
    let [error, setError] = useState({
        email: "",
        full_name: "",
        password: "",
        c_password: "",
    })
    let handleForm = (e) => {
       let {name, value} = e.target
       setFormData({...FormData, [name]:value})
       setError({})
    }
    let handleSubmitClick = () => {
        setLoader(true)
        let expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!FormData.email){
            setError({...error, email: "Email ditea hobea"})
            setLoader(false)
        }
        else if(!expression.test(FormData.email)){
            setError({...error, email: "valid Email ditea hobea"})
            setLoader(false)
        }
        else if(!FormData.full_name){
            setError({...error, full_name: "Fullname ditea hobea"})
            setLoader(false)
        }
        else if(!FormData.password){
            setError({...error, password: "Password ditea hobea"})
            setLoader(false)
        }
        else if(!FormData.c_password){
            setError({...error, c_password: "Confirm Password ditea hobea"})
            setLoader(false)
        }
        else if(FormData.password != FormData.c_password){
            setError({...error, c_password: "Don't matched"})
            setLoader(false)
        }
        else{
            createUserWithEmailAndPassword(auth, FormData.email, FormData.password).then((user)=>{
                sendEmailVerification(auth.currentUser).then(() => {
                    updateProfile(auth.currentUser, {
                        displayName: FormData.full_name,
                    }).then(() => {
                        set(ref(database, 'users/' + user.user.uid), {
                          displayName: user.user.displayName,
                          email: user.user.email,
                          profilephoto: "https://firebasestorage.googleapis.com/v0/b/linkedin-clone-92170.appspot.com/o/profile_photo%2Fprofile_avatar.png?alt=media&token=708a01aa-5a98-4b38-9a4a-deec271372e4&_gl=1*1q3gar5*_ga*Mzg4MDcwNjM2LjE2ODA2NzU4NTg.*_ga_CW55HF8NVT*MTY4NTUzMjY1Ny4zNi4xLjE2ODU1MzI3MzEuMC4wLjA.",
                        }).then(()=>{
                            toast("Registration Successfully");
                            setTimeout(()=>{
                                setLoader(false)
                                navigate("/")
                            },2000)
                        })
                      }).catch((error) => {
                        console.log(error)
                      });
                    // toast("Registration Successfully and send a vefication mail");
                    // setTimeout(()=>{
                    //     setLoader(false)
                    //     navigate("/")
                    // },3000)
                });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode.includes("auth/email-already-in-use")){
                    setError({...error, email: "Email already existed"})
                    setLoader(false)
                };
                
              });
        }
    }

  return (
    <Flex className="box_main">
        <ToastContainer />
        <Box className='box'>
            <Box className='logo_holder'>
                <Images src="./assets/images/logo.png"/>
            </Box>
            <Box className='login_title'>
                <Title className="auth_title" title="Registration"/>
                <Peragraph className="auth_subtitle" title="First register and you can enjoy it"/>
            </Box>
            <Flex className='form'>
                <Box className="input_group">
                    <Input name="email" onChange={handleForm} className="login_input" type="email" placeholder="Email Address"/>
                    {error.email &&
                        <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                            {error.email}
                        </Alert>
                    }
                </Box>
                <Box className="input_group">
                    <Input name="full_name" onChange={handleForm} className="login_input" type="text" placeholder="Full Name"/>
                    {error.full_name &&
                        <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                            {error.full_name}
                        </Alert>
                    }
                </Box>
                <Box className="input_group">
                    <Input name="password"  onChange={handleForm} className="login_input" type={showPass ? "text" : "password"} placeholder="Password"/>
                    {showPass 
                    ?
                    <AiFillEye onClick={()=>setShowPass(false)} className='openeye'/>
                    :
                    <AiFillEyeInvisible onClick={()=>setShowPass(true)} className='openeye'/>
                    }
                    {error.password &&
                        <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                            {error.password}
                        </Alert>
                    }
                </Box>
                <Box className="input_group">
                    <Input name="c_password"  onChange={handleForm} className="login_input" type={showCPass ? "text" : "password"} placeholder="Confirm Password"/>
                    {showCPass 
                    ?
                    <AiFillEye onClick={()=>setShowCPass(false)} className='openeye'/>
                    :
                    <AiFillEyeInvisible onClick={()=>setShowCPass(true)} className='openeye'/>
                    }
                    {error.c_password &&
                        <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                            {error.c_password}
                        </Alert>
                    }
                </Box>
                <Button onClick={handleSubmitClick} className="login_btn" title="sign up"/>
            </Flex>
            <Authentication className='reg_auth' title='Already have an account?' href='/' hreftitle='sign in'/>
            {loader &&
            <div className='reg_loader'>
                <Puff
                height="100"
                width="100"
                radius={1}
                color="#fff"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                />
            </div>
            }
        </Box>
    </Flex>
  )
}

export default Index