import React, { useState } from 'react'
import Flex from '../../components/Flex'
import Images from '../../components/Images'
import Input from '../../components/Input'
import Peragraph from '../../components/Peragraph'
import Title from '../../components/Title'
import Button from '../../components/Button'
import Authentication from '../../components/Authentication'
import { activeUser } from '../../slices/userSlices';
import {AiFillEye,AiFillEyeInvisible} from 'react-icons/ai'
import {RxCross2} from "react-icons/rx"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, set, push,remove} from "firebase/database";
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Puff } from  'react-loader-spinner';
import "./style.css"


const Index = () => {
  <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 475,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

    const auth = getAuth();
    let navigate = useNavigate()
    let dispatch = useDispatch();
    let [showPass, setPass] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    let [loader, setLoader] = useState(false);
    let data= useSelector(state => state)
    let db = getDatabase()

    let handleforgotexitbtn = () => {
      setOpen(false)
    }
    let [FormData, setFormData] = useState({
      email: "",
      password: "",
      forgotpass: "",
  })
  let [error, setError] = useState({
      email: "",
      password: "",
      forgotpass: "",
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
      else if(!FormData.password){
        setError({...error, password: "Password ditea hobea"})
        setLoader(false)
      }
      else{
        signInWithEmailAndPassword(auth, FormData.email, FormData.password)
        .then((userCredential) => {
            dispatch(activeUser(userCredential.user))
            localStorage.setItem("userInfo",JSON.stringify(userCredential.user))
            if(userCredential.user.emailVerified){
             
              // console.log(data.userData.userInfo.displayName)
              set(push(ref(db, 'useractivity')), {
                activestatus: "active",
                activeuseremail: FormData.email,
              }).then(()=>{
                setTimeout(()=>{
                  setLoader(false)
                  navigate("/home")
                },1000)
              })
            }else{
              setLoader(false)
              toast("Please verify your email first.");
              signOut(auth).then(() => {
                localStorage.removeItem("userInfo")
                dispatch(activeUser(null))
              })
            }
          })
          .catch((error) => {
          setLoader(false)
          const errorCode = error.code;
          const errorMessage = error.message;
          toast("Incorrect email or password");
        });
      }
  }

  let handleForgotpassword = () => {
    let expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if(!FormData.forgotpass){
          setError({...error, forgotpass: "Email ditea hobea"})
      }
      else if(!expression.test(FormData.forgotpass)){
          setError({...error, forgotpass: "valid Email ditea hobea"})
      }
      else{
        sendPasswordResetEmail(auth,FormData.forgotpass)
        .then(() => {
          toast("Email send successfully");
          setOpen(false)
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast("Crediantial Not Found");
          setOpen(false)
        });
      }
  } 

  return (
    <>
        <Flex className="box_main">
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
          <ToastContainer />
            <Flex className='box'>
                <Flex className='logo_holder'>
                    <Images src="./assets/images/logo.png"/>
                </Flex>
                <Flex className='login_title'>
                    <Title className="auth_title" title="login"/>
                    <Peragraph className="auth_subtitle" title="First login and you can explore it"/>
                </Flex>
                <Flex className='form'>
                    <Flex className="input_group">
                        <Input onChange={handleForm} name="email" className="login_input" type="email" placeholder="Email Address"/>
                        {error.email &&
                            <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                                {error.email}
                            </Alert>
                        }
                    </Flex>
                    <Flex className="input_group">
                        <Input onChange={handleForm} name="password" className="login_input" type={showPass ? "text" : "password"} placeholder="Password"/>
                        {showPass 
                        ?
                        <AiFillEye onClick={()=>setPass(false)} className='openeye'/>
                        :
                        <AiFillEyeInvisible onClick={()=>setPass(true)} className='openeye'/>
                        }
                        {error.password &&
                            <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                                {error.password}
                            </Alert>
                        }
                    </Flex>
                    <Button onClick={handleSubmitClick} className="login_btn" title="sign in"/>
                </Flex>
                <Authentication className='reg_auth' title="Don't have an account?" href='/registration' hreftitle='sign up'/>
                <Authentication onClick={handleOpen} className='reg_auth forgot_auth' title="Reset your password?" hreftitle='Click here'/>
                <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Typography style={{display: "flex", alignItems: "center",justifyContent:"space-between", padding: "5px 0 5px 0"}} id="modal-modal-title" variant="h6" component="h2">
                          <Title className="auth_title forgot_title" title="Forgot Password"/>
                          <Flex onClick={handleforgotexitbtn} className="forgot_exit_btn">
                            <RxCross2/>
                          </Flex>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <Input onChange={handleForm} name="forgotpass" className="login_input" type="email" placeholder="Email Address"/>
                            {error.forgotpass &&
                              <Alert style={{padding:"0 16px", marginTop:"10px"}} variant="filled" severity="error">
                                  {error.forgotpass}
                              </Alert>
                            }
                          <Button onClick={handleForgotpassword} className="login_btn forgot_btn" title="Send Mail"/>
                        </Typography>
                      </Box>
                </Modal>
            </Flex>
        </Flex>
    </>
  )
}

export default Index