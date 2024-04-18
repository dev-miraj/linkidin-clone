import React, { useEffect, useState } from 'react'
import { getDatabase,ref as dbref, onValue,remove,set, push,update} from "firebase/database";
import { useDispatch,useSelector } from 'react-redux'
import Title from '../../components/Title';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import {BsThreeDotsVertical} from 'react-icons/bs'
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {Box,Button,Typography,Modal,TextField} from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const MyGroup = () => {

  const db = getDatabase();
  let data= useSelector(state => state)
  let [mygrouplist, setMygrouplist] = useState([])
  let [groupname, setgroupname] = useState()
  let [grlist, setGrlist] = useState([])
  let [gmemberlist, setGmemberlist] = useState([])

  const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
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

const handleOpen = (item) => {
    setOpen(true)
    setgroupname(item.groupname);
        const starCountRef = dbref(db, 'grouprequest');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach(grdata=>{
                if(grdata.val().groupid == item.id){
                    arr.push({...grdata.val(),deleteid:grdata.key})  
                }
            })
            setGrlist(arr)
        });

        const starCountRef2 = dbref(db, 'groupmembers');
        onValue(starCountRef2, (snapshot) => {
            let arr = []
            snapshot.forEach(groupmember=>{
                if(groupmember.val().groupid == item.id){
                    arr.push({...groupmember.val(),deleteid:groupmember.key})  
                }
            })
            setGmemberlist(arr)
        });
    };

    let hundleGroupReqDelete = (item) =>{
        remove(dbref(db, 'grouprequest/'+ item.deleteid)).then(()=>{
            toast("Request removed..");
        });
    };
    let hundleGroupReqAccept = (item) =>{
        set(push(dbref(db, 'groupmembers')), {
            ...item,
            date:`${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`
          }).then(()=>{
            remove(dbref(db, 'grouprequest/'+ item.deleteid)).then(()=>{
                toast("Member Added Successfully..");
            });
          });
    }


  // my group list operation
  useEffect(()=>{
    const starCountRef = dbref(db, 'group');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach(item=>{
            if(item.val().whocreateid == data.userData.userInfo.uid){
                arr.push({...item.val(),id:item.key})
            }
        })
        setMygrouplist(arr)
    });
  },[])


  //tab panel operation
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
    TabPanel.propTypes = {
      children: PropTypes.node,
      index: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    };
    
    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const [value, setValue] = React.useState(0);



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
        <Title className="suggest_user_title" title="My Group"/>
        <div className='suggestuser_wrapper'>
            {mygrouplist.length > 0 ? mygrouplist.map(item=>(
                <div className='suggest_user_item'>
                    <div className='suggest_user'>
                        <NavLink to="#">
                            <div className='img_holder'>
                                <h3>{item.groupname[0]}</h3>
                            </div>
                        </NavLink>
                        <div className='suggest_user_info'>
                            <NavLink to="#">
                                <h2>{item.groupname}</h2>
                            </NavLink>
                            <p>{item.grouptitle}</p>
                        </div>
                    </div>
                        <button onClick={()=>handleOpen(item)} className='add_btn group'>
                            <BsThreeDotsVertical/>
                        </button>
                </div>
            ))
            :
            <h3>Not Available</h3>
            }
        </div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
                    
          <Box sx={style}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <h1 className='groupmodal_name'>{groupname}</h1>
                <Tabs className='tabs_wrapper' style={{justifyContent:"center"}} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Pending Request" {...a11yProps(0)} />
                    <Tab label="Member" {...a11yProps(1)} />
                    <Tab label="Notification" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <div className='group_pending_wrapper'>
                       {grlist.length > 0 ? grlist.map(item=>(
                            <div className='group_pending_main'> 
                                <div className='member_info'>
                                    <div className='member_img_holder'>
                                        <img/>
                                    </div>
                                    <div className='member_details_holder'>
                                        <h3>{item.whojoinname}</h3>
                                        <p>{item.whojoinemail}</p>
                                    </div>
                                </div>
                                <div className='member_actions'>
                                    <button onClick={()=>hundleGroupReqAccept(item)}>Accept</button>
                                    <button onClick={()=>hundleGroupReqDelete(item)} className='delete'>Delete</button>
                                </div>
                        </div>
                       )):
                            <h3>No Pending Request Available</h3>
                       }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className='group_pending_wrapper'>
                       {gmemberlist.length > 0 ? gmemberlist.map(item=>(
                            <div className='group_pending_main'> 
                                <div className='member_info'>
                                    <div className='member_img_holder'>
                                        <img/>
                                    </div>
                                    <div className='member_details_holder'>
                                        <h3>{item.whojoinname}</h3>
                                        <p>{item.whojoinemail}</p>
                                    </div>
                                </div>
                                <div className='member_actions'>
                                    
                                    <button className='delete'>Block</button>
                                </div>
                        </div>
                       )):
                            <h3>No Pending Request Available</h3>
                       }
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    <h3>No Notification</h3>
                    </List>
                </TabPanel>
            </Box>
          </Box>
      </Modal>
    </>
  )
}

export default MyGroup