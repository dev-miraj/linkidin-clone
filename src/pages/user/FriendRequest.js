import React, { useEffect,useState } from 'react'
import "./user.css"
import Images from '../../components/Images';
import { getDatabase, ref, onValue,remove,set, push} from "firebase/database";
import { useSelector,useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import Title from '../../components/Title';
import Alert from '@mui/material/Alert';
import { NavLink } from 'react-router-dom';

const FriendRequest = () => {
    const db = getDatabase();
    let [frequest, setfreqest] = useState([])
    let data= useSelector(state => state)
    
    useEffect(()=>{
        const starCountRef = ref(db, 'friendrequest');
        onValue(starCountRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item=>{
                if(item.val().receiverid == data.userData.userInfo.uid){
                    arr.push({...item.val(),id:item.key})
                }
            })
            setfreqest(arr)
        });
    },[])
    let handleCancelRequest = (cancel_info) =>{
        remove(ref(db, 'friendrequest/'+ cancel_info.id)).then(()=>{
            toast("Request Cancel..")
        });  
    }
    let handleConfirmRequest = (friendrequest) => {
        set(push(ref(db, 'friends')), {
            ...friendrequest,
            date:`${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`
          }).then(()=>{
            remove(ref(db, 'friendrequest/'+ friendrequest.id)).then(()=>{
                toast("Request Confirm..")
            });
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
    <Title className="suggest_user_title" title="Friends Request"/>
    <div className='suggestuser_wrapper'>
        {
            frequest.length > 0 
            ?
            frequest.map(item=>(
                <div className='suggest_user_item'>
                    <div className='suggest_user'>
                        <NavLink to={'/profile/'+item.senderid}>
                            <div className='img_holder'>
                                {data.userData.userInfo
                                ?
                                    data.userData.userInfo.photoURL
                                    ?
                                    <Images src={data.userData.userInfo.photoURL}/>
                                    :
                                    <h3>{item.sendername[0]}</h3>
                                :
                                <h3>{item.sendername[0]}</h3>
                                }
                            </div>
                        </NavLink>
                        <div className='suggest_user_info'>
                            <NavLink to={'/profile/'+item.senderid}>
                                <h2>{item.sendername}</h2>
                            </NavLink>
                            <p>{item.senderemail}</p>
                        </div>
                    </div>
                    <div className='f_req_btn_wrapper'>
                        <button onClick={()=> handleConfirmRequest(item)} className='add_btn'>Confirm</button>
                        <button onClick={()=> handleCancelRequest(item)} className='add_btn delete'>Delete</button>
                    </div>
                </div>
            ))
            :
            <Alert variant="filled" severity="error">
               No friend request available..
            </Alert>
        }
    </div>
    </>
  )
}

export default FriendRequest