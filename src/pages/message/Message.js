import React, { useEffect } from 'react'
import "./message.css"
import {RxCross2} from "react-icons/rx"
import {BiMinus} from "react-icons/bi"
import {BsThreeDotsVertical,BsPlusCircleFill} from "react-icons/bs"
import {AiFillLike} from "react-icons/ai"
import {RiSendPlane2Fill} from "react-icons/ri"
import { useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { activeUser } from '../../slices/activeChatSlice'
import Images from '../../components/Images'
import { getDatabase, ref, onValue,remove,set, push} from "firebase/database";
import ScrollToBottom from 'react-scroll-to-bottom';
import {BsEmojiSmile} from 'react-icons/bs'
import {IoIosCall} from 'react-icons/io'
import EmojiPicker from 'emoji-picker-react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { getStorage, ref as sref, uploadBytes,getDownloadURL,uploadString  } from "firebase/storage";
import { ToastContainer, toast } from 'react-toastify';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
// import Menu from '@mui/material/Menu';



const Message = () => {
    
    const storage = getStorage();
    let dispatch = useDispatch();
    const db = getDatabase();
    let data = useSelector((state)=>state)
    let [minimize, setMinimize] = useState(false)
    let [boxexit, setBoxexit] = useState(false)
    let [mediabox,setMediobox] = useState(false)
    let [msg,setMsg] = useState("")
    let [msgList, setMsgList] = useState([])
    let [showemoji, setShowemoji] = useState(false);
    let [isCamera, setisCamera] = useState(false)
    let [imgviewmodal, setImgviewmodal] = useState(false)
    let [voicebox, setVoicebox] = useState(true)
    let [audiourl, setAudioUrl] = useState("");
  let [blob, setBlob] = useState("");
    let [chatimgfullview, setChatimgfullview] = useState()


let handleMinimize = () => {
    if(minimize == false){
        setMinimize(true)
    }else{
        setMinimize(false)
    }
}
let handleExit = () => {
    dispatch(activeUser(null))  
    if(boxexit == false){
        setBoxexit(true)
    }else{
        setBoxexit(false)
    }
}


//one by one msg operation
let handleSendMsg = () => {
      if(data.activeChatUser.activeUser.status == "singlemsg"){
        set(push(ref(db, 'onebyonemsg')), {
          whosendid: data.userData.userInfo.uid,
          whosendname: data.userData.userInfo.displayName,
          whoreceivedid: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
            ?
            data.activeChatUser.activeUser.receiverid 
            :
            data.activeChatUser.activeUser.senderid
          ,
          whoreceivedname: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
            ?
            data.activeChatUser.activeUser.receivername 
            :
            data.activeChatUser.activeUser.sendername
          , 
          message: msg,
          date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
        }).then(()=>{
          setMsg("")
          setShowemoji(false)
          setMediobox(false)
        })
      }
  }

  //Enter key press msg send
    let handleKeyPress = (e) => {
        if(e.key == "Enter"){
            if(data.activeChatUser.activeUser.status == "singlemsg"){
                set(push(ref(db, 'onebyonemsg')), {
                  whosendid: data.userData.userInfo.uid,
                  whosendname: data.userData.userInfo.displayName,
                  whoreceivedid: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
                    ?
                    data.activeChatUser.activeUser.receiverid 
                    :
                    data.activeChatUser.activeUser.senderid
                  ,
                  whoreceivedname: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
                    ?
                    data.activeChatUser.activeUser.receivername 
                    :
                    data.activeChatUser.activeUser.sendername
                  , 
                  message: msg,
                  date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
                }).then(()=>{
                  setMsg("")
                  setShowemoji(false)
                  setMediobox(false)
                })
              }
        }
    }

    let handleSendLike = () => {
        if(data.activeChatUser.activeUser.status == "singlemsg"){
            set(push(ref(db, 'onebyonemsg')), {
              whosendid: data.userData.userInfo.uid,
              whosendname: data.userData.userInfo.displayName,
              whoreceivedid: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
                ?
                data.activeChatUser.activeUser.receiverid 
                :
                data.activeChatUser.activeUser.senderid
              ,
              whoreceivedname: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
                ?
                data.activeChatUser.activeUser.receivername 
                :
                data.activeChatUser.activeUser.sendername
              , 
              like: "&#128077;",
              date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
            }).then(()=>{
              setMediobox(false)
            })
          }
    }

  useEffect(()=>{
    const starCountRef = ref(db, 'onebyonemsg');
    onValue(starCountRef, (snapshot) => {
        let arr = []
        let id = data.activeChatUser.activeUser.receiverid == data.userData.userInfo.uid ?
            data.activeChatUser.activeUser.senderid : data.activeChatUser.activeUser.receiverid;
        snapshot.forEach(item=>{
          if((item.val().whosendid == data.userData.userInfo.uid && item.val().whoreceivedid == id) || (item.val().whosendid == id && item.val().whoreceivedid == data.userData.userInfo.uid)){
            arr.push(item.val())  
          }
        })
        setMsgList(arr)
    });
},[data.activeChatUser.activeUser])
 
let handleEmoji = (e) => {
    setMsg(msg + e.emoji)
  }

  let handlemediabox = () => {
      if(mediabox == true){
        setMediobox(false)
    }else{
        setMediobox(true)
    }
  }
  

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    // document.body.appendChild(audio);
    setAudioUrl(url);
    setBlob(blob);
  };
  let handleAudioUpload = () => {
    const audioStorageRef = sref(storage, 'voice/'+Date.now());
    uploadBytes(audioStorageRef, blob).then((snapshot) => {
      getDownloadURL(audioStorageRef).then((downloadURL) => {
        set(push(ref(db, "onebyonemsg")), {
          whosendid: data.userData.userInfo.uid,
          whosendname: data.userData.userInfo.displayName,
          whoreceivedid: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
              ?
              data.activeChatUser.activeUser.receiverid 
              :
              data.activeChatUser.activeUser.senderid
            ,
            whoreceivedname: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
              ?
              data.activeChatUser.activeUser.receivername 
              :
              data.activeChatUser.activeUser.sendername
            , 
          audio: downloadURL,
          date: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
        }).then(() => {
          setAudioUrl("");
        });
      });
    });
  };

  //Chat image send operation
  let handleChatImg = (e) =>{
    const storageRef = sref(storage, "singlechatimg/"+e.target.files[0].name);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        if(data.activeChatUser.activeUser.status == "singlemsg"){
          set(push(ref(db, 'onebyonemsg')), {
            whosendid: data.userData.userInfo.uid,
            whosendname: data.userData.userInfo.displayName,
            whoreceivedid: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid
              ?
              data.activeChatUser.activeUser.receiverid
              :
              data.activeChatUser.activeUser.senderid
            ,
            whoreceivedname: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid
              ?
              data.activeChatUser.activeUser.receivername 
              :
              data.activeChatUser.activeUser.sendername
            , 
            onebyoneimg: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
          }).then(()=>{
            setMsg("")
            setMediobox(false)
          })
        }
      }).then(()=>{
        setMediobox(false)
      })
    });
  }
  
  //Camera open and capture img send
  let handleCameraClick = () => {
    setisCamera(true)
  }
  function handleTakePhoto (dataUri) {
    const storageRef = sref(storage, 'singlechatimg/'+ Date.now());
    const message4 = dataUri;
    uploadString(storageRef, message4, 'data_url').then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        if(data.activeChatUser.activeUser.status == "singlemsg"){
          set(push(ref(db, 'onebyonemsg')), {
            whosendid: data.userData.userInfo.uid,
            whosendname: data.userData.userInfo.displayName,
            whoreceivedid: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
              ?
              data.activeChatUser.activeUser.receiverid 
              :
              data.activeChatUser.activeUser.senderid
            ,
            whoreceivedname: data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid 
              ?
              data.activeChatUser.activeUser.receivername 
              :
              data.activeChatUser.activeUser.sendername
            , 
            onebyoneimg: downloadURL,
            date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
          }).then(()=>{
            setisCamera(false)
            setMediobox(false)
          })
        }
      })
    });
  }
  let handleimgfullview = (item) =>{
    setChatimgfullview(item);
    setImgviewmodal(true)
  } 
  let handlecancelimgmodal = () => {
    setImgviewmodal(false)
  }

  return (
    <>
         {isCamera &&
            <div className='camera_main' style={{position:"absolute",left:0,top:0,}}>
              <button onClick={()=>setisCamera(false)} className='close_btn'>Close</button>
              <Camera
                onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                idealResolution = {{width: "90%", height: "100%"}}
                imageCompression = {0.97}
                isMaxResolution = {true}
                isImageMirror = {false}
                isSilentMode = {false}
                isDisplayStartCameraError = {false}
                isFullscreen = {true}
                sizeFactor = {1}
              />
            </div>
          }
      {/* ==== chat img full view start ==== */}
      {
        imgviewmodal &&
        <div className='chatimg_fullview'>
            <img src={chatimgfullview}/>
            <button onClick={handlecancelimgmodal}>Cancel</button>
        </div>
      }
      {/* ==== chat img full view end ==== */}
        <div className={boxexit ? "main_box exit" : minimize ? "main_box close" : "main_box"}>
            <div className='box_head'>
                <div className='user_info'>
                    <div className='user_img_box'>
                        {data.userData.userInfo.photoURL 
                          ?
                          <img src={data.userData.userInfo.photoURL}/>
                          :
                            data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid
                            ?
                            <h3>{data.activeChatUser.activeUser.receivername[0]}</h3>
                            :
                            <h3>{data.activeChatUser.activeUser.sendername[0]}</h3>
                        }
                    </div>
                    <div className='user_name'>
                        {data.userData.userInfo.uid == data.activeChatUser.activeUser.senderid
                        ?
                        <h3>{data.activeChatUser.activeUser.receivername}</h3>
                        :
                        <h3>{data.activeChatUser.activeUser.sendername}</h3>
                        }
                        <p>Active now</p>
                    </div>
                </div>
                <div className='user_action'>
                    <div className='audio_call'>
                        <IoIosCall/>
                    </div>
                    <div onClick={handleMinimize} className="msg_minimize_btn">
                        <BiMinus/>
                    </div>
                    <div onClick={handleExit} className='msg_exit_btn'>
                        <RxCross2/>
                    </div>
                </div>
            </div>
            <ScrollToBottom className='box_body'>
                {msgList.map((item)=>(
                    item.whosendid == data.userData.userInfo.uid
                     ?
                        <div className='send_msg'>
                            <div className='send_text_box'>
                                <span className='send_msg_action'>
                                    <BsThreeDotsVertical/>
                                </span>
                                {item.message
                                ?
                                <p>{item.message}</p>
                                :
                                    item.onebyoneimg
                                    ?
                                    <div onClick={()=>handleimgfullview(item.onebyoneimg)} className='onebyoneimg'>
                                      <img src={item.onebyoneimg} alt='img'/>
                                    </div>
                                    :
                                      item.audio
                                      ?
                                      <audio controls src={item.audio}></audio>
                                      :
                                      <p
                                          dangerouslySetInnerHTML={{
                                          __html: item.like,
                                          }} className='msg_like_emoji'></p>
                                }
                                
                            </div>
                        </div>
                     :
                        <div className='receive_msg'>
                            <div className='receive_text_box'>
                                <span className='receive_msg_action'>
                                    <BsThreeDotsVertical/>
                                </span>
                                {item.message
                                ?
                                <p>{item.message}</p>
                                :
                                  item.onebyoneimg
                                  ?
                                  <div onClick={()=>handleimgfullview(item.onebyoneimg)} className='onebyoneimg'>
                                    <img src={item.onebyoneimg} alt='img'/>
                                  </div>
                                  :
                                    item.audio
                                    ?
                                    <audio controls src={item.audio}></audio>
                                    :
                                    <p
                                      dangerouslySetInnerHTML={{
                                      __html: item.like,
                                      }} className='msg_like_emoji'></p>
                                }
                            </div>
                        </div>

                ))}
            </ScrollToBottom>
            <div className='box_footer'>
              {
                !audiourl &&
                <div className='voice_box'>
                    <div className='voice_plus_icon'onClick={handlemediabox}>
                        <BsPlusCircleFill/>
                    </div>
                        {
                          mediabox &&
                          <div className='voice_modal'>
                              <ul>
                                  <li>Voice</li>
                                  <li onClick={handleCameraClick}>Camera</li>
                                  <li>
                                      File
                                      <input multiple onChange={handleChatImg} type='file' className='msg_send_file'/>
                                  </li>
                              </ul>   
                          </div>
                          }
                </div>
              }
                {!audiourl &&
                <AudioRecorder 
                        onRecordingComplete={addAudioElement}
                        audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                        }} 
                        downloadOnSavePress={false}
                        downloadFileExtension="mp3"
                    />
                }
                    {!audiourl &&
                      <>
                        <div className='media_box'>
                            <input onKeyUp={handleKeyPress} onChange={(e)=>setMsg(e.target.value)} value={msg} className='input_box'/>
                            <div className='msg_emoji'>
                                <BsEmojiSmile onClick={()=>setShowemoji(!showemoji)}/>
                                {showemoji &&
                                    <div className='msg_emoji_box'>
                                        <EmojiPicker onEmojiClick={(e)=>handleEmoji(e)}/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='send_btn'>
                            {msg != "" 
                              ?
                              <div onClick={handleSendMsg} className='send_icon'>
                                  <RiSendPlane2Fill/>
                              </div>
                              :
                              <div onClick={handleSendLike} className='like_icon'>
                                  <AiFillLike/>
                              </div>
                            }
                        </div>
                      </>
                    }
                    {audiourl && (
                      <div className="voice_send_wrapper">
                        <audio controls src={audiourl}></audio>
                        <div className='voice_btn_wrapper'>
                            <button
                              className=""
                              onClick={() => setAudioUrl("")}
                            >
                              Delete
                            </button>
                            <button
                              onClick={handleAudioUpload}
                              className=""
                            >
                              Send
                            </button>
                        </div>
                      </div>
                    )}
            </div>
        </div>
    </>
  )
}

export default Message