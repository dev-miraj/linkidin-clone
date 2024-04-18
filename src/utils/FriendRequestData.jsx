import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FriendRequestData = () => {
  const db = getDatabase();
  let [frequest, setfreqest] = useState([]);
  let data = useSelector((state) => state);

  useEffect(() => {
    const starCountRef = ref(db, "friendrequest");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().receiverid == data.userData.userInfo.uid) {
          arr.push({ ...item.val(), id: item.key });
        }
      });
      setfreqest(arr);
    });
  }, []);
  return (
    <>
      {frequest && frequest.length >= 0 ? (
        <h1>Friend Request Count: {frequest.length}</h1>
      ) : null}
    </>
  );
};

export default FriendRequestData;
