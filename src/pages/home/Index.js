import React, { useEffect,useState } from 'react'
import "./style.css"
import {signOut, onAuthStateChanged, getAuth, updateProfile} from "firebase/auth";
import { getDatabase,ref as dbref, onValue,remove,set, push} from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import { activeUser } from '../../slices/userSlices';
import CreatePost from './CreatePost';
import PostCard from '../profile/PostCard';


const Index = () => {

  let data = useSelector(state => state)
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const auth = getAuth();
  let [post, setPost] = useState([])
  const db = getDatabase();

  useEffect(()=>{
    if(!data.userData.userInfo){
      navigate("/")
    }
  },[])
      //====== post operation
      useEffect(()=>{
        const starCountRef = dbref(db, 'post');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item=>{
              if(item.val().whopostid !=  data.userData.userInfo && data.userData.userInfo.uid){
                arr.push({...item.val(),id:item.key})
              }
            })
            setPost(arr)
        });
      },[])


  return (
    <>
      <div className='home_wrapper'>
          <CreatePost/>
          <div className='home_post_main'> 
            {
              post.length > 0
              ?
              post.map(item=>(
                <PostCard postid={item.id} postdate={item.date} creatorid={item.whopostid} creatorname={item.whopostname} posttext={item.posttext}/>
              ))
              :
              <h3>No Post Available..</h3>
            }
          </div>
      </div>      
    </>
  )
}

export default Index