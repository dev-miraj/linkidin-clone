import React, { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";

export const FriendsData = () => {
  const [totalFriends, setTotalFriends] = useState([]);
  let data = useSelector((state) => state);

  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "friends");
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
      setTotalFriends(arr);
    });
  }, []);
  return (
    <>
      {totalFriends && totalFriends.length >= 0 ? (
        <h1>Total Friends: {totalFriends.length}</h1>
      ) : null}
    </>
  );
};
