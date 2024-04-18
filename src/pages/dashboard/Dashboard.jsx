import React, { useState } from "react";
import { FriendsData } from "../../utils/FriendsData";
import "./dashboard.css";
import FriendRequestData from "../../utils/FriendRequestData";
import BlockUserData from "../../utils/BlockUserData";
import AllUsersData from "../../utils/AllUsersData";

const Dashboard = () => {
  return (
    <section className="dashboard-main">
      <div className="container">
        <div className="data-container">
          <div>
            <AllUsersData />
          </div>
          <div>
            <FriendsData />
          </div>
          <div>
            <FriendRequestData />
          </div>
          <div>
            <BlockUserData />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
