import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BlockUserData = () => {
  let [blocklist, setblocklist] = useState([]);
  let data = useSelector((state) => state);
  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "block");
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid == data.userData.userInfo.uid) {
          arr.push({
            id: item.key,
            block: item.val().block,
            blockid: item.val().blockid,
          });
        }
      });
      setblocklist(arr);
    });
  }, []);
  return (
    <>
      {blocklist && blocklist.length >= 0 ? (
        <h1>Block User Count: {blocklist.length}</h1>
      ) : null}
    </>
  );
};

export default BlockUserData;
