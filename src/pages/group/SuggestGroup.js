import React, { useEffect, useState } from 'react'
import { getDatabase,ref as dbref, onValue,remove,set, push,update} from "firebase/database";
import { useDispatch,useSelector } from 'react-redux'
import Title from '../../components/Title';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const SuggestGroup = () => {

    const db = getDatabase();
    let data= useSelector(state => state)
    let [suggestgrouplist, setSuggestgrouplist] = useState([])
    let [joinedgroup,setJoinedGroup] = useState([])
    let [grouprequest,setGroupreqest] = useState([])

    useEffect(()=>{
        const starCountRef = dbref(db, 'group');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item=>{
                if(item.val().whocreateid != data.userData.userInfo.uid){
                    arr.push({...item.val(),groupid:item.key})
                }
            })
            setSuggestgrouplist(arr)
        });
      },[])

      let handleJoinGroup = (item) => {
        set(push(dbref(db, 'grouprequest')), {
            groupid: item.groupid,
            groupname: item.groupname,
            grouptitle: item.grouptitle,
            whojoinid: data.userData.userInfo.uid,
            whojoinname: data.userData.userInfo.displayName,
            whojoinemail: data.userData.userInfo.email,
            adminid: item.whocreateid,
            adminname: item.whocreatename,
            date: item.date,
        })
      }

      useEffect(()=>{
        const usersRef = dbref(db, 'groupmembers');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item=>{
                if(item.val().whojoinid == data.userData.userInfo.uid){
                    arr.push(item.val().whojoinid + item.val().groupid)
                }
            })
            setJoinedGroup(arr)
        });
    },[])

    useEffect(()=>{
        const usersRef = dbref(db, 'grouprequest');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item=>{
                if(item.val().whojoinid == data.userData.userInfo.uid ){
                    arr.push(item.val().whojoinid + item.val().groupid)
                }
            })
            setGroupreqest(arr)
        });
    },[])


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
        <Title className="suggest_user_title" title="Suggest Group"/>
        <div className='suggestuser_wrapper'>
            {suggestgrouplist.length > 0 ? suggestgrouplist.map(item=>(
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
                    {
                        joinedgroup.includes(data.userData.userInfo.uid + item.groupid) 
                        ?
                        <button className='add_btn friend'>Joined</button>
                        :
                            grouprequest.includes(data.userData.userInfo.uid + item.groupid ) 
                            ? 
                            <button className='add_btn friend'>Pending</button>
                            :
                            <button onClick={()=>handleJoinGroup(item)} className='add_btn friend'>Join</button>
                    }
                </div>
            ))
            :
            <h3>Not Available</h3>
            }
        </div>
        
    </>
  )
}

export default SuggestGroup