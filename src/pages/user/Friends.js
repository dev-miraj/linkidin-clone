import React, { useEffect,useState } from 'react'
import "./user.css"
import Images from '../../components/Images';
import { getDatabase, ref, onValue,remove,set, push} from "firebase/database";
import { useSelector, useDispatch } from 'react-redux';
import Title from '../../components/Title';
import { ToastContainer, toast } from 'react-toastify';
import Alert from '@mui/material/Alert';
import { activeUser } from '../../slices/activeChatSlice';
import { NavLink } from 'react-router-dom';


const Friends = () => {
  let data = useSelector(state => state)
  const db = getDatabase();
  let dispatch = useDispatch();
  let [friends, setfriends] = useState([])

  useEffect(()=>{
    const starCountRef = ref(db, 'friends');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        snapshot.forEach(item=>{
            if(data.userData.userInfo.uid == item.val().receiverid || data.userData.userInfo.uid == item.val().senderid){
                arr.push({...item.val(),id:item.key})
            } 
        })
        setfriends(arr)
    });
  },[])
  console.log(friends);
  let hundleBlock = (item) =>{
    data.userData.userInfo.uid == item.senderid 
    ?
        set(push(ref(db, 'block')), {
            block: item.receivername,
            blockid: item.receiverid,
            blockby: item.sendername,
            blockbyid: item.senderid,
        }).then(()=>{
            remove(ref(db, 'friends/'+ item.id)).then(()=>{
                toast("Block Done..");
            });
        })
    :
        set(push(ref(db, 'block')), {
            block: item.sendername,
            blockid: item.senderid,
            blockby: item.receivername,
            blockbyid: item.receiverid,
        }).then(()=>{
            remove(ref(db, 'friends/'+ item.id)).then(()=>{
                toast("Block Done..");
            });
        })
}

let handleMessageBox = (item) => {
    dispatch(activeUser({...item, status:"singlemsg"}))
}

  return (
    <>
      <Title className="suggest_user_title" title="Friends"/>
      <div className='suggestuser_wrapper'>
        {
          friends.length > 0
          ?
          friends.map(item=>(
          <div className='suggest_user_item'>
              <div className='suggest_user'>
                    {
                       data.userData.userInfo.uid == item.senderid
                       ?
                       <NavLink to={'/profile/'+item.receiverid}>
                            <div className='img_holder'>
                                <Images/>
                            </div>
                        </NavLink>
                       : 
                       <NavLink to={'/profile/'+item.senderid}>
                            <div className='img_holder'>
                                <Images/>
                            </div>
                        </NavLink>
                    }
                    
                  <div className='suggest_user_info'>
                        {data.userData.userInfo.uid == item.senderid 
                        ? 
                            <NavLink to={'/profile/'+item.receiverid}>
                                <h2>{item.receivername}</h2>
                            </NavLink>
                        :
                            <NavLink to={'/profile/'+item.senderid}>
                                <h2>{item.sendername}</h2>
                            </NavLink>
                        }
                      <p>{item.date}</p>
                  </div>
              </div>
              <div className='f_req_btn_wrapper'>
                  <button onClick={()=>handleMessageBox(item)} className='add_btn'>Message</button>
                  <button onClick={()=>hundleBlock(item)} className='add_btn delete'>Block</button>
              </div>
          </div>
          ))
          :
          <Alert variant="filled" severity="error">
            No Friend available..
          </Alert>
        }
      </div>
    </>
  )
}

export default Friends