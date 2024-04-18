import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import Flex from '../../components/Flex';
import Images from '../../components/Images';
import {BsFillCameraFill,BsGlobeAmericas} from "react-icons/bs";
import { useSelector,useDispatch } from 'react-redux';
import { getDatabase, ref, onValue, set, push,remove} from "firebase/database";
import PostCard from './PostCard';
import { activeUser } from '../../slices/activeChatSlice';

const UserProfile = () => {
  
  const { id } = useParams();
  let data = useSelector(state => state)
  let [userlist,setUserlist] = useState([])
  let db = getDatabase()
  let dispatch = useDispatch();
  let [friends, setfriends] = useState([])
  let [post, setPost] = useState([])
  let [biotext, setBiotext] = useState([])
  let [guestuserName, setguestuserName] = useState("")

    useEffect(()=>{
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
          let arr = []
          snapshot.forEach(item=>{
              if(id == item.key){
                  arr.push({
                      ...item.val(), 
                      id:item.key,
                  })
              }
          })
          setUserlist(arr)
      });
  },[])
  useEffect(()=>{
    const starCountRef = ref(db, 'friends');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach(item=>{
            if(id == item.val().receiverid || id == item.val().senderid){
                arr.push({...item.val(),id:item.key})
            } 
        })
        setfriends(arr)
    });
  },[])

  useEffect(()=>{
    const starCountRef = ref(db, 'post');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach(item=>{
          if(item.val().whopostid == id){
            arr.push({...item.val(),id:item.key})
          }
        })
        setPost(arr)
    });
  },[])

  useEffect(()=>{
    const starCountRef = ref(db, 'bio');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach(item=>{
          if(item.val().whobioid == id){
            arr.push({...item.val(),id:item.key})  
          }
        })
        setBiotext(arr)
    });
  },[])

  useEffect(()=>{
    userlist.map(item=>(
      setguestuserName(item.displayName)
    ))
  })

  let handleMessageBox = () => {
    dispatch(activeUser({senderid: data.userData.userInfo.uid,receiverid: id, sendername: data.userData.userInfo.displayName,receivername:guestuserName, status:"singlemsg"}))
}


  return (
    <>
    <Flex className="container">
        <Flex className="cover_photo">
            <Images src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-92170.appspot.com/o/cover_photo%2Fprofile_cover.jpg?alt=media&token=3ddad611-c652-400b-9984-855d2de82416&_gl=1*1jav6c3*_ga*Mzg4MDcwNjM2LjE2ODA2NzU4NTg.*_ga_CW55HF8NVT*MTY4NTUyOTAzMS4zNS4xLjE2ODU1MjkxMjEuMC4wLjA."/>
        </Flex>
        <Flex className="profile_photo_wrapper">
            <div className='photo_and_name_wrapper'>
              <Flex className="profile_photo_holder">
                    <h3>{guestuserName[0]}</h3>
                  {/* <Images src="assets/images/profile_avatar.png"/> */}
              </Flex>
              <Flex className="profile_owner_name">
                <h2>{guestuserName}</h2>
                  <h4>{friends.length} Friends</h4>
              </Flex>
            </div>
            <div>
              <a onClick={handleMessageBox} className='profile_dashboard'>Message</a>
            </div>
        </Flex>
        <Flex className="profile_body">
            <Flex className="profile_intro">
                <h2>Intro</h2>
                <Flex className="bio_box">
                  {
                    biotext.map(item=>(
                      <p value={item.biotext}>{item.biotext}</p>
                    ))
                  }
                </Flex>
            </Flex>
            <div className='post_main'>
              <Flex className="profile_post_wrapper">
                    {
                      post.length > 0 
                      ?
                      post.map(item=>(
                        <PostCard postid={item.id} postdate={item.date} creatorname={item.whopostname} creatorid={item.whopostid} posttext={item.posttext} item={item}/>
                      ))
                      :
                      <h3>No Post Available</h3>
                    }
              </Flex>
            </div>
        </Flex> 

    </Flex>
    
    </>
  )
}

export default UserProfile