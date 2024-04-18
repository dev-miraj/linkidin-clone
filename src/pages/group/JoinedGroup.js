import React, { useEffect, useState } from 'react'
import { getDatabase,ref as dbref, onValue,remove,set, push,update} from "firebase/database";
import { useDispatch,useSelector } from 'react-redux'
import Title from '../../components/Title';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const JoinedGroup = () => {

  const db = getDatabase();
  let data= useSelector(state => state)
  let [joinedgroup, setJoinedgroup] = useState([])

  useEffect(()=>{
    const starCountRef = dbref(db, 'groupmembers');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach(item=>{
            if(item.val().whojoinid == data.userData.userInfo.uid){
                arr.push({...item.val(),groupmemberid:item.key})
            }
        })
        setJoinedgroup(arr)
    });
  },[])

let handlegroupleave = (item)=>{
  remove(dbref(db, 'groupmembers/'+ item.groupmemberid)).then(()=>{
    toast("Leave..");
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
        <Title className="suggest_user_title" title="Joined Group"/>
        <div className='suggestuser_wrapper'>
            {joinedgroup.length > 0 ? joinedgroup.map(item=>(
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
                        <button onClick={()=>handlegroupleave(item)} className='add_btn group_leave'>
                            Leave
                        </button>
                </div>
            ))
            :
            <h3>Not Available</h3>
            }
        </div>
    </>
  )
}

export default JoinedGroup