import React, { useEffect, useState } from "react";
import Flex from "../../components/Flex";
import Images from "../../components/Images";
import { BsFillCameraFill, BsGlobeAmericas } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import "./style.css";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import {
  getDatabase,
  ref as dbref,
  onValue,
  remove,
  set,
  push,
  update,
} from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { activeUser } from "../../slices/userSlices";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { Puff } from "react-loader-spinner";
import { Link, NavLink } from "react-router-dom";
import CreatePost from "../home/CreatePost";
import PostCard from "./PostCard";
import Button from "../../components/Button";
import { FaGlobeAmericas } from "react-icons/fa";
import MyModal from "../../components/MyModal";

const Profile = () => {
  let [loader, setLoader] = useState(false);
  const auth = getAuth();
  let dispatch = useDispatch();
  let data = useSelector((state) => state);
  let [friends, setfriends] = useState([]);
  let [post, setPost] = useState([]);
  const db = getDatabase();
  let [like, setLike] = useState([]);
  let [introbox, setIntrobox] = useState(false);
  let [bio, setBio] = useState([]);
  let [biodata, setBioData] = useState({});
  let [biotext, setBiotext] = useState([]);

  //Bio Operation Start Here
  let handleIntrosave = () => {
    set(dbref(db, "bio/" + data.userData.userInfo.uid), {
      whobioid: data.userData.userInfo.uid,
      whobioname: data.userData.userInfo.displayName,
      biotext: bio,
      date: `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getMilliseconds()}`,
    }).then(() => {
      setBio("");
      setIntrobox(false);
    });
  };
  useEffect(() => {
    const starCountRef = dbref(db, "bio");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().whobioid == data.userData.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
          setBioData(item.val());
        }
      });
      setBiotext(arr);
    });
  }, []);

  let handleBioEdit = () => {
    setIntrobox(true);
    setBio(biodata.biotext);
  };

  //====== friends count operation
  useEffect(() => {
    const starCountRef = dbref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          data.userData.userInfo.uid == item.val().receiverid ||
          data.userData.userInfo.uid == item.val().senderid
        ) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setfriends(arr);
    });
  }, []);

  //====== post operation
  useEffect(() => {
    const starCountRef = dbref(db, "post");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().whopostid == data.userData.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setPost(arr);
    });
  }, []);

  // ===== Crop Image Start =====
  const [image, setImage] = useState();
  const [profile, setProfile] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoader(true);
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profile_photo/${data.userData.userInfo.uid}`
      );
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url")
        .then((snapshot) => {
          // console.log('Uploaded a data_url string!');
          setOpen(false);
          setImage("");
          getDownloadURL(storageRef).then((downloadURL) => {
            updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            }).then(() => {
              toast("Profile Picture Upload Successfully..");
              dispatch(activeUser(auth.currentUser));
              localStorage.setItem(
                "userInfo",
                JSON.stringify(auth.currentUser)
              );

              // update(ref(db, 'users/'+ data.userData.userInfo.uid),{
              //   profilephoto: downloadURL
              // });
            });
          });
        })
        .then(() => {
          setLoader(false);
        });
    }
  };
  // ===== Crop Image End =====

  // ======= Modal Part Start ========
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  // ======= Modal Part End ========

  // ================ Post query===========
  let handlecoveropen = () => {
    console.log("cover popup open");
  };

  return (
    <>
      {loader && (
        <div className="reg_loader">
          <Puff
            height="100"
            width="100"
            radius={1}
            color="#fff"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <Flex className="container">
        <Flex className="cover_photo">
          <Images src="assets/images/profile_cover.jpg" />
          <button onClick={handlecoveropen}>
            <BsFillCameraFill />
            <span>Edit Cover Photo</span>
          </button>
        </Flex>
        <Flex className="profile_photo_wrapper">
          <div className="photo_and_name_wrapper">
            <Flex className="profile_photo_holder">
              {data.userData.userInfo ? (
                data.userData.userInfo.photoURL ? (
                  <Images src={data.userData.userInfo.photoURL} />
                ) : (
                  <h3>{data.userData.userInfo.displayName[0]}</h3>
                )
              ) : (
                <h3>{data.userData.userInfo.displayName[0]}</h3>
              )}
              <Flex onClick={handleOpen} className="profile_img_icon">
                <BsFillCameraFill />
              </Flex>
            </Flex>
            <Flex className="profile_owner_name">
              <h2>
                {data.userData.userInfo
                  ? data.userData.userInfo.displayName
                  : ""}
              </h2>
              <h4>{friends.length} Friends</h4>
            </Flex>
          </div>
          <div>
            {/* <a href='#' className='profile_dashboard'>Dashboard</a> */}
            <Link to="/dashboard" className="profile_dashboard">
              Dashboard
            </Link>
          </div>
        </Flex>
        <Flex className="profile_body">
          <Flex className="profile_intro">
            <h2>Intro</h2>
            <Flex className="bio_box">
              {introbox ? (
                <>
                  <textarea
                    onChange={(e) => setBio(e.target.value)}
                    value={bio ? (bio.length > -1 ? bio : biodata.biotext) : ""}
                    className="intro_input"
                    placeholder="Write Bio..."
                  ></textarea>
                  <h6 className="character_count">
                    {bio && 90 - bio.length} characters remaining
                  </h6>
                  <div className="intro_footer">
                    <div className="bio_public">
                      <FaGlobeAmericas />
                      <span>Public</span>
                    </div>
                    <div className="intro_btn_wrapper">
                      <Button
                        className="intro_cancel_btn"
                        onClick={() => setIntrobox(false)}
                        title="Cancel"
                      ></Button>
                      {bio && bio.length > 90 ? (
                        <Button
                          className="intro_cancel_btn save"
                          title="Save"
                        ></Button>
                      ) : bio && bio.length > 0 ? (
                        <Button
                          className="intro_cancel_btn save_visible"
                          onClick={handleIntrosave}
                          title="Save"
                        ></Button>
                      ) : (
                        <Button
                          className="intro_cancel_btn save"
                          title="Save"
                        ></Button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {biotext.map((item) => (
                    <p value={item.biotext}>{item.biotext}</p>
                  ))}
                  {biotext.length > 0 ? (
                    <Button
                      onClick={handleBioEdit}
                      className="bio_btn"
                      title="Edit Bio"
                    />
                  ) : (
                    <Button
                      onClick={handleBioEdit}
                      className="bio_btn"
                      title="Add Bio"
                    />
                  )}
                </>
              )}
            </Flex>
          </Flex>
          <div className="post_main">
            <CreatePost />
            <Flex className="profile_post_wrapper">
              {post.length > 0 ? (
                post.map((item) => (
                  <PostCard
                    postid={item.id}
                    postdate={item.date}
                    creatorname={item.whopostname}
                    creatorid={item.whopostid}
                    posttext={item.posttext}
                    item={item}
                  />
                ))
              ) : (
                <h3>No Post Available</h3>
              )}
            </Flex>
          </div>
        </Flex>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
                Choose Profile Photo
              </h3>
              <div className="pro_edit_preview">
                {image ? (
                  <div className="img-preview"></div>
                ) : data.userData.userInfo ? (
                  data.userData.userInfo.photoURL ? (
                    <Images
                      src={data.userData.userInfo.photoURL}
                      className="profile_img"
                    />
                  ) : (
                    <Images
                      src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-92170.appspot.com/o/profile_photo%2Fprofile_avatar.png?alt=media&token=708a01aa-5a98-4b38-9a4a-deec271372e4&_gl=1*1q3gar5*_ga*Mzg4MDcwNjM2LjE2ODA2NzU4NTg.*_ga_CW55HF8NVT*MTY4NTUzMjY1Ny4zNi4xLjE2ODU1MzI3MzEuMC4wLjA."
                      className="profile_img"
                    />
                  )
                ) : (
                  <Images
                    src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-92170.appspot.com/o/profile_photo%2Fprofile_avatar.png?alt=media&token=708a01aa-5a98-4b38-9a4a-deec271372e4&_gl=1*1q3gar5*_ga*Mzg4MDcwNjM2LjE2ODA2NzU4NTg.*_ga_CW55HF8NVT*MTY4NTUzMjY1Ny4zNi4xLjE2ODU1MzI3MzEuMC4wLjA."
                    className="profile_img"
                  />
                )}
              </div>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input
                style={{ textAlign: "center" }}
                onChange={onChange}
                type="file"
              />
              {image && (
                <>
                  <Cropper
                    style={{ height: 400, width: "100%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    onInitialized={(instance) => {
                      setCropper(instance);
                    }}
                    guides={true}
                  />
                  <button className="cropper_btn" onClick={getCropData}>
                    Upload
                  </button>
                </>
              )}
            </Typography>
          </Box>
        </Modal>
      </Flex>
    </>
  );
};

export default Profile;
