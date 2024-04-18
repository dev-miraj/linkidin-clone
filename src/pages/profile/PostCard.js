import React, { useState,useEffect } from 'react'
import "./style.css"
import Flex from '../../components/Flex'
import Images from '../../components/Images'
import { NavLink } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import {AiOutlineLike,AiFillLike} from "react-icons/ai"
import {RiShareForwardLine} from 'react-icons/ri'
import {BsThreeDotsVertical} from 'react-icons/bs'
import {VscComment} from 'react-icons/vsc'
import { getDatabase, ref, onValue, set, push,remove, update} from "firebase/database";
import Menu from '@mui/material/Menu';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Title from '../../components/Title';
import {RxCross2} from "react-icons/rx";
import Button from '../../components/Button'
import {BsEmojiSmile} from 'react-icons/bs'
import EmojiPicker from 'emoji-picker-react';

const PostCard = ({posttext,creatorname, creatorid,postdate,postid,item}) => {


    let [showemoji, setShowemoji] = useState(false);
    let [post, setPost] = useState(posttext)

    const [open2, setOpen2] = React.useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    
    let [showMore, setShowMore] = useState(false);
    let MAX_LENGTH = 200;

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

    let data= useSelector(state => state)
    let db = getDatabase()
    let [like,setLike] = useState([])
    let [likearr,setLikeArr] = useState([])

    let handleLike = () => {
        set(ref(db, 'like/'+(data.userData.userInfo.uid+postid)), {
            wholikeid: data.userData.userInfo.uid,
            wholikename: data.userData.userInfo.displayName,
            postid: postid,
          }).then(()=>{
            console.log("like done")
          })
    }

    let handleDisLike = (id)=>{
        remove(ref(db, 'like/'+id)).then(()=>{
            console.log("Delete Hoise")
        })
    }

    useEffect(()=>{
        const starCountRef = ref(db, 'like');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            let likearr = []
            snapshot.forEach(item=>{               
                if(postid == item.val().postid){
                    arr.push({...item.val(),likeid:item.key})
                    likearr.push(item.val().wholikeid+postid)
                }
            })
            setLike(arr)
            setLikeArr(likearr)
        });
    },[])


const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //post Delete Part
  let handlePostDelete = () => {
    remove(ref(db, 'post/'+ postid)).then(()=>{
        toast("Post Deleted..");
    });
    setAnchorEl(null);
  }
  //Post Edit Part
  let handlePostEditBtn = () => {
    setOpen2(true)
    setAnchorEl(null);
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

  let handleforgotexitbtn = () => {
    setOpen2(false)
    setShowemoji(false)
    setPost(posttext)
  }
  let handleEmoji = (e) => {
    setPost(post + e.emoji)
  }
  
  //post update operation
  let handleUpdatePost = () =>{
    update(ref(db, 'post/'+ postid),{
        ...item,
        posttext: post
    }).then(()=>{
        setOpen2(false)
    });
  }
  

  return (
    <>
        <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
        <Flex className="profile_post_item">
            <Flex className="post_head">
                <NavLink to={'/profile/'+creatorid}>
                    <div className='post_owner_img'>
                        {data.userData.userInfo.photoURL 
                        ?
                        <Images src={data.userData.userInfo.photoURL}/>
                        :
                        <h3>{creatorname[0]}</h3>  
                        }
                    </div>
                </NavLink>
                <div className='creator_name'>
                    <NavLink to={'/profile/'+creatorid}>
                        <h4>{creatorname}</h4>
                    </NavLink>
                    <span className='post_date'>{postdate}</span>
                </div>
                <div 
                    className='profile_post_actions' 
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <BsThreeDotsVertical/>
                </div>
                {creatorid == data.userData.userInfo.uid
                ?
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <p className='post_action_item' onClick={handlePostEditBtn}>Edit</p>
                    <p className='post_action_item' onClick={handlePostDelete}>Delete</p>
                </Menu>
                :
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <p onClick={handleClose} className='post_action_item'>Close</p>
                    <p onClick={handleClose} className='post_action_item'>Report</p>
                </Menu>
                }
             
            </Flex>
             {posttext.length>MAX_LENGTH
             ?
             showMore ? (
                <>
                    <p>{posttext}</p>
                    <button onClick={toggleShowMore} className='see_more_btn'>See Less</button>
                </>
            ) : (
                <p>
                    {posttext.substr(0, MAX_LENGTH)}
                    {posttext.length > MAX_LENGTH && "..."}
                    <button onClick={toggleShowMore} className='see_more_btn'>See more</button>
                </p>
            )
            :
            <p>{posttext}</p>
        }
            <Flex className="post_actions_count">
                <Flex className="likes_count">
                    <span>{like.length} Likes</span>
                </Flex>
                <Flex className="comments_count">
                    <span>22 Comment</span>
                </Flex>
            </Flex>
            <Flex className="post_actions_btn">
                
                {  likearr.includes(data.userData.userInfo.uid+postid)
                ?
                <>
                    <div onClick={()=>handleDisLike(data.userData.userInfo.uid+postid)} className='like_btn liked'>
                        <AiFillLike/>
                        <span>Liked</span>
                    </div>
                </>
                :
                <div onClick={handleLike} className='like_btn'>
                    <AiOutlineLike/>
                    <span>Like</span>
                </div>
                }
                
                <div className='like_btn'>
                    <VscComment/>
                    <span>Comment</span>
                </div>
                <div className='like_btn'>
                    <RiShareForwardLine/>
                    <span>Share</span>
                </div>
            </Flex>
        </Flex>
                <Modal
                    open={open2}
                    onClose={handleClose2}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                > 
                    <Box sx={style}>
                        <div className='create_post_head'>
                            <Title className="create_post_title" title="Update Post"/>
                            <Flex onClick={handleforgotexitbtn} className="forgot_exit_btn post_exit_btn">
                                <RxCross2/>
                            </Flex>
                        </div>
                        <div className='create_post_body'>
                            <div className='post_creator'>
                                <NavLink to="/profile">
                                    <div className='post_owner_img'>
                                        {data.userData.userInfo
                                        ?
                                            data.userData.userInfo.photoURL
                                            ?
                                            <Images src={data.userData.userInfo.photoURL}/>
                                            :
                                            <h3>{data.userData.userInfo.displayName[0]}</h3>
                                        :
                                        <h3>{data.userData.userInfo.displayName[0]}</h3>
                                        }
                                    </div>
                                </NavLink>
                                <div className='creator_name'>
                                    <h3>{data.userData.userInfo.displayName}</h3>
                                </div>
                            </div>
                            <div className='textarea_main'>
                                <textarea onChange={(e)=>setPost(e.target.value)} value={post} placeholder="What's on your mind ?" className="post_input_text">
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
                                    post == posttext
                                    ?
                                    <Button className="post_btn hide_post_btn" title="Update Post"/>
                                    :
                                    <Button onClick={handleUpdatePost} className="post_btn" title="Update Post"/>
                                :
                                <Button className="post_btn hide_post_btn" title="Update Post"/>
                                
                            }
                           
                        </div>
                    </Box>
                </Modal>
    </>
  )
}

export default PostCard