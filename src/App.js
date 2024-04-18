import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "./pages/login/Index";
import Registration from "./pages/registration/Index";
import firebaseConfig from "./configuration/firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/home/Index";
import RootLayout from "./pages/layouts/RootLayout";
import Video from "./pages/video/Index";
import Shop from "./pages/shop/Index";
import Group from "./pages/group/Index";
import Profile from "./pages/profile/Index";
import HomeLayout from "./pages/layouts/HomeLayout";
import SuggestUser from "./pages/user/SuggestUser";
import FriendRequest from "./pages/user/FriendRequest";
import Friends from "./pages/user/Friends";
import BlockUser from "./pages/user/BlockUser";
import MyModal from "./components/MyModal";
import Message from "./pages/message/Message";
import GroupPost from "./pages/group/GroupPost";
import MyGroup from "./pages/group/MyGroup";
import JoinedGroup from "./pages/group/JoinedGroup";
import PendingGroup from "./pages/group/PendingGroup";
import SuggestGroup from "./pages/group/SuggestGroup";
import UserProfile from "./pages/profile/UserProfile";
import Error404 from "./pages/error/Error404";
import Demo from "./pages/error/Demo";
import Dashboard from "./pages/dashboard/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />}></Route>
      <Route path="/registration" element={<Registration />}></Route>
      <Route path="*" element={<Error404 />}></Route>
      <Route element={<RootLayout />}>
        <Route element={<HomeLayout />}>
          <Route path="home" element={<Home />}></Route>
          <Route path="video" element={<Video />}></Route>
          <Route path="shop" element={<Shop />}></Route>
          <Route element={<Group />}>
            <Route path="group-post" index element={<GroupPost />}></Route>
            <Route path="my-group" element={<MyGroup />}></Route>
            <Route path="joined-group" element={<JoinedGroup />}></Route>
            <Route path="pending-group" element={<PendingGroup />}></Route>
            <Route path="suggest-group" element={<SuggestGroup />}></Route>
          </Route>
          <Route path="suggestuser" element={<SuggestUser />}></Route>
          <Route path="friendrequest" element={<FriendRequest />}></Route>
          <Route path="friends" element={<Friends />}></Route>
          <Route path="block" element={<BlockUser />}></Route>
          <Route path="modal" element={<MyModal />}></Route>
        </Route>
        <Route path="profile" element={<Profile />}></Route>
        <Route path="dashboard" element={<Dashboard />}></Route>
        <Route path="profile/:id" element={<UserProfile />}></Route>
        <Route path="message" element={<Message />}></Route>
        <Route path="demo" element={<Demo />}></Route>
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
