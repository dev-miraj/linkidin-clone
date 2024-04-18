import React, { useEffect,useState } from 'react'
import {signOut, onAuthStateChanged, getAuth, updateProfile} from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import { activeUser } from '../../slices/userSlices';
import "./layout.css"
import Flex from '../../components/Flex'
import { Outlet } from 'react-router-dom'
import Images from '../../components/Images';
import {MdSettingsSuggest} from 'react-icons/md'
import {FaUserPlus} from 'react-icons/fa'
import {HiUsers} from 'react-icons/hi'
import {FaUserSlash} from 'react-icons/fa'

const HomeLayout = () => {
  let data= useSelector(state => state)
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const auth = getAuth();

  let handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("userInfo")
      dispatch(activeUser(null))
      navigate("/")
    }).catch((error) => {
      // An error happened.
    });
    
  }

  return (
    <>
        <Flex className="homelayout_main">
            <Flex className="left_sidebar_holder">
                <Flex className="left_sidebar">
                  <Flex className="left_sidebar_nav">
                      <NavLink to="profile">
                        <div className='left_sidebar_nav_wrapper'>
                          <div className='left_sidebar_navimg'>
                            {data.userData.userInfo
                            ?
                              data.userData.userInfo.photoURL
                              ?
                              <Images src={data.userData.userInfo.photoURL}/>
                              :
                              <h3>{data.userData.userInfo.displayName[0]}</h3>  
                            :
                            <h3>{data.userData.userInfo && data.userData.userInfo.displayName[0]}</h3>
                            }
                          </div>
                          <h4>
                            {
                              data.userData.userInfo
                              ?
                              data.userData.userInfo.displayName
                              :
                              ""
                            }
                          </h4>
                        </div>
                      </NavLink>
                      <NavLink to="suggestuser">
                        <div className='left_sidebar_nav_wrapper'>
                            <MdSettingsSuggest/>
                            <span>Suggestions User</span>
                        </div>
                      </NavLink>
                      <NavLink to="friendrequest">
                        <div className='left_sidebar_nav_wrapper'>
                            <FaUserPlus/>
                            <span>Friends Request</span>
                        </div>
                      </NavLink>
                      <NavLink to="friends">
                        <div className='left_sidebar_nav_wrapper'>
                            <HiUsers/>
                            <span>Friends</span>
                        </div>
                      </NavLink>
                      <NavLink to="block">
                        <div className='left_sidebar_nav_wrapper'>
                            <FaUserSlash/>
                            <span>Block User</span>
                        </div>
                      </NavLink>
                  </Flex>
                  <Flex className="logout_btn">
                    <button onClick={handleLogout}>Logout</button>
                  </Flex>
                </Flex>
            </Flex>
            <Flex className="middle_bar_holder">
                <Outlet/>
            </Flex>

            <Flex className="right_sidebar_holder">

            </Flex>
        </Flex>
    </>
  )
}

export default HomeLayout