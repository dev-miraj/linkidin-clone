import React, { useEffect, useState } from 'react'
import './group.css'
import { useDispatch,useSelector } from 'react-redux'
import { getDatabase, ref, onValue, set, push,remove, update} from "firebase/database";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {RxCross2} from "react-icons/rx"
import Title from '../../components/Title';
import Flex from '../../components/Flex';
import { NavLink, Outlet } from 'react-router-dom';
import Images from '../../components/Images';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

const Group = () => {

  const db = getDatabase();
  let navigate = useNavigate()
  let data= useSelector(state => state)
  let [groupName ,setGroupName] = useState({})
  let [groupTitle ,setGroupTitle] = useState({})

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '0',
    boxShadow: 24,
    p: 0,
    borderRadius: 2,
  };

  let handleCreateGroupModal = () => {
    setOpen(true)
  }
  
  let handleforgotexitbtn = () => {
    setOpen(false)
    setGroupName("")
    setGroupTitle("")
  }
  let handleCreateGroup = () => {
    set(push(ref(db, 'group')), {
      whocreateid: data.userData.userInfo.uid,
      whocreatename: data.userData.userInfo.displayName,
      groupname: groupName,
      grouptitle: groupTitle,
      groupimg: "",
      date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
    }).then(()=>{
      toast("Group Create Done");
      setGroupName("")
      setGroupTitle("")
      setOpen(false)
      navigate("my-group")
    })
  }


  return (
    <>
    
      <div className='group_heading'>
          <h1>Group</h1>
          <a onClick={handleCreateGroupModal} href='#'>Create Group</a>
      </div>
      <div className='group_nav'>
        <NavLink to="group-post">
            Post
        </NavLink>
        <NavLink to="suggest-group">
          Suggest Group
        </NavLink>
        <NavLink to="my-group">
            My Group
        </NavLink>
        <NavLink to="joined-group">
            Joined Group
        </NavLink>
        <NavLink to="pending-group">
            Pending Group
        </NavLink>
        
      </div>
      <div className='group_body'>
          <Outlet/>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                    
          <Box sx={style}>
            <div className='create_post_head'>
                <Title className="create_post_title" title="Create Group"/>
                <Flex onClick={handleforgotexitbtn} className="forgot_exit_btn post_exit_btn">
                    <RxCross2/>
                </Flex>
            </div>
            <div className='create_post_body'>
                <div className='post_creator'>
                    <NavLink to="/profile">
                        <div className='post_owner_img'>
                            <Images src={data.userData.userInfo.photoURL}/>
                        </div>
                    </NavLink>
                    <div className='creator_name'>
                        <h3>{data.userData.userInfo.displayName}</h3>
                    </div>
                </div>
                <div className='create_group_body'>
                    <Input onChange={(e)=>setGroupName(e.target.value)} placeholder="Group Name"/>
                    <Input onChange={(e)=>setGroupTitle(e.target.value)} placeholder="Group Title"/>
                </div>
                { groupName.length > 0 & groupTitle.length > 0
                  ?
                  <Button onClick={handleCreateGroup} className="post_btn" title="Create Group"/>
                  :
                  <Button className="post_btn hide_post_btn" title="Create Group"/>
                }
            </div>
          </Box>
      </Modal>
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
    </>
  )
}

export default Group