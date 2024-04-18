import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AllUsersData = () => {
  let data = useSelector((state) => state);
  let [userlist, setUserlist] = useState([]);
  let db = getDatabase();
  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.userData.userInfo.uid != item.key) {
          arr.push({
            ...item.val(),
            id: item.key,
          });
        }
      });
      setUserlist(arr);
    });
  }, []);
  return (
    <>
      {userlist && userlist.length >= 0 ? (
        <h1>Sytem's All User: {userlist.length}</h1>
      ) : null}
    </>
  );
};

export default AllUsersData;
