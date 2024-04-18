import React,{useState} from 'react'
import "./createpost.css"
import Images from '../../components/Images'
import { useDispatch,useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {RiLiveLine} from "react-icons/ri"
import {TbPhoto} from "react-icons/tb"
import {MdOutlineEmojiEmotions} from "react-icons/md"
import {RxCross2} from "react-icons/rx"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Peragraph from '../../components/Peragraph'
import Title from '../../components/Title'
import Button from '../../components/Button'
import Flex from '../../components/Flex'
import Input from '../../components/Input'
import { getDatabase, ref, onValue,remove,set, push} from "firebase/database";
import { Puff } from  'react-loader-spinner';
import {BsEmojiSmile} from 'react-icons/bs'
import EmojiPicker from 'emoji-picker-react';

const CreatePost = () => {
    const db = getDatabase();
    let data= useSelector(state => state)
    
    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let [post, setPost] = useState([])
  let [loader, setLoader] = useState(false);
  let [showemoji, setShowemoji] = useState(false);

  let handleforgotexitbtn = () => {
    setOpen(false)
    setShowemoji(false)
    setPost("")
  }
  let handlePost = () =>{
        setLoader(true)
      set(push(ref(db, 'post')), {
        whopostid: data.userData.userInfo.uid,
        whopostname: data.userData.userInfo.displayName,
        posttext: post,
        date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
      }).then(()=>{
        setPost("")
      })
      setOpen(false)
      setLoader(false)
      setShowemoji(false)
  }
  let handleKeyPressPost = (e) => {
    if(e.key == "Enter"){
        console.log(post)
    }
  }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 580,
        bgcolor: 'background.paper',
        border: '0',
        boxShadow: 24,
        p: 0,
        borderRadius: 2,
      };

      let handleEmoji = (e) => {
        setPost(post + e.emoji)
      }
      
  return (
    <>
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
        <div className='post_wrapper'>
            <div className='post_input_group'>
                <NavLink to="/profile">
                    <div className='post_owner_img'>
                        {data.userData.userInfo &&
                        data.userData.userInfo.photoURL 
                        ?
                        <Images src={data.userData.userInfo.photoURL}/>
                        :
                        <h3>{data.userData.userInfo && data.userData.userInfo.displayName[0]}</h3>
                        }
                    </div>
                </NavLink>
                <div onClick={handleOpen} className='post_input_box'>
                    <span className='post_input_placeholder'>
                        What's on your mind, {data.userData.userInfo && data.userData.userInfo.displayName}?
                    </span>
                </div>
            </div>
            <div className='post_actions'>
                <div className='post_actions_item'>
                    <RiLiveLine/>
                    <span>Live video</span>
                </div>
                <div className='post_actions_item'>
                    <TbPhoto/>
                    <span>Photo/video</span>
                </div>
                <div className='post_actions_item'>
                    <MdOutlineEmojiEmotions/>
                    <span>Feling/activity</span>
                </div>
            </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    
                    <Box sx={style}>
                        <div className='create_post_head'>
                            <Title className="create_post_title" title="Create Post"/>
                            <Flex onClick={handleforgotexitbtn} className="forgot_exit_btn post_exit_btn">
                                <RxCross2/>
                            </Flex>
                        </div>
                        <div className='create_post_body'>
                            <div className='post_creator'>
                                <NavLink to="/profile">
                                    <div className='post_owner_img'>
                                        {
                                           data.userData.userInfo
                                           ?
                                            data.userData.userInfo.photoURL
                                            ?
                                            <Images src={data.userData.userInfo.photoURL}/>
                                            :
                                            <h3>{data.userData.userInfo.displayName[0]}</h3>
                                           : 
                                           <h3>{data.userData.userInfo && data.userData.userInfo.displayName[0]}</h3>
                                        }
                                    </div>
                                </NavLink>
                                <div className='creator_name'>
                                    <h3>{data.userData.userInfo && data.userData.userInfo.displayName}</h3>
                                </div>
                            </div>
                            <div className='textarea_main'>
                                <textarea onKeyUp={handleKeyPressPost} onChange={(e)=>setPost(e.target.value)} value={post} placeholder="What's on your mind ?" className="post_input_text">

                                </textarea>
                                <BsEmojiSmile onClick={()=>setShowemoji(!showemoji)}/>
                                {showemoji &&
                                    <div className='emoji_box'>
                                        <EmojiPicker onEmojiClick={(e)=>handleEmoji(e)}/>
                                    </div>
                                }
                            </div>
                            {
                                post != ""
                                ?
                                <Button onClick={handlePost} className="post_btn" title="Post"/>
                                :
                                <Button className="post_btn hide_post_btn" title="Post"/>
                                
                            }
                        </div>
                    </Box>
                </Modal>
        </div>
    </>
  )
}

export default CreatePost