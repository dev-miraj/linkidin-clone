import React, { useEffect,useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Flex from '../../components/Flex'
import Images from '../../components/Images'
import {AiFillHome} from "react-icons/ai"
import {MdOutlineOndemandVideo} from "react-icons/md"
import {BsShopWindow} from "react-icons/bs"
import {HiUserGroup} from "react-icons/hi"
import {GrGamepad} from "react-icons/gr"
import {CgMenuGridR} from "react-icons/cg"
import {BsMessenger} from "react-icons/bs"
import {RxCross2} from "react-icons/rx"
import {IoIosNotifications} from "react-icons/io"
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import "./layout.css"
import Input from '../../components/Input'
import { motion } from "framer-motion";
import Message from '../message/Message'

const variants = {
    open: { width: 400,opacity:1 },
    close: { width:0,opacity:0 }
  };
  

const RootLayout = () => {
    let navigate = useNavigate();
    let data= useSelector(state => state)
    let clickedUser = useSelector((state)=>state.activeChatUser.activeUser)
    let [topstate, setTopState] = useState(false)
    let [sidebarclick, setSidebarclick] = useState(false)

    useEffect(()=>{
        if(!data.userData.userInfo){
          navigate("/")
        }
      },[])

   

      console.log(data.userData.userInfo);
    let handleProfileClick = () =>{
        navigate("profile")
    }
    useEffect(()=>{
        window.addEventListener("scroll",function(){
            const istop = window.scrollY < 150
            if(istop != true){
                setTopState(true)
            }else{
                setTopState(false)
            }
        })
    })
  return (
    <> 
        {clickedUser !== null &&
            <Message/>
        }
        <motion.div className='layout_sidebar' 
            variants={variants}
            animate={sidebarclick ? 'open' : 'close'}
            transition={{duration:0.5}}
        >
            <div className='sidebar_head'>
                <h2>Notification</h2>
                <div onClick={()=>setSidebarclick(false)} className='exit_btn'>
                    <RxCross2/>
                </div>
            </div>
            <div className='sidebar_body'>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
                <div className='sidebar_item'></div>
            </div>
        </motion.div>
        <Flex className={topstate ? "layout_main fixed":"layout_main"}>
            <Flex className="nav_logo">
                <Link to="home">
                    <Images src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-92170.appspot.com/o/logo%2Flogo.png?alt=media&token=e9eb73ee-6fbb-4b96-8346-aa8b441e3509&_gl=1*1kocr65*_ga*Mzg4MDcwNjM2LjE2ODA2NzU4NTg.*_ga_CW55HF8NVT*MTY4NTUyOTAzMS4zNS4xLjE2ODU1Mjk0MzAuMC4wLjA."/>
                </Link>
                <Flex className="root_search_holder">
                    <Input type="text" placeholder="Search Here..." className="root_search"/>
                </Flex>
            </Flex>
            <Flex className="nav_menu">
                <NavLink to="home">
                    <AiFillHome/>
                </NavLink>
                <NavLink to="video">
                    <MdOutlineOndemandVideo/>
                </NavLink>
                <NavLink to="shop">
                    <BsShopWindow/>
                </NavLink>
                <NavLink to="group-post">
                    <HiUserGroup/>
                </NavLink>
            </Flex>
            <Flex className="nav_action">
                <Flex className="nav_action_item">
                    <CgMenuGridR/>
                </Flex>
                <Flex onClick={()=>setSidebarclick(!sidebarclick)} className="nav_action_item">
                    <BsMessenger/>
                </Flex>
                <Flex onClick={()=>setSidebarclick(!sidebarclick)} className="nav_action_item">
                    <IoIosNotifications/>
                </Flex>
                <Flex onClick={handleProfileClick} className="nav_action_item">
                {data.userData.userInfo
                    ?
                        data.userData.userInfo.photoURL
                        ?

                        // <Images src="hello"/>
                        <Images src={data.userData.userInfo.photoURL}/>
                        :
                        <h3>{data.userData.userInfo.displayName[0]}</h3>
                    :
                    <h3>{data.userData.userInfo && data.userData.userInfo.displayName[0]}</h3>
                    }
                </Flex>
            </Flex>
        </Flex>
        <Outlet/>
    </>
  )
}

export default RootLayout