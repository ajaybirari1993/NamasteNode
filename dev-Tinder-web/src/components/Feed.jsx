import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);

  const dispatch = useDispatch();

  const getfeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getfeed();
  }, []);

  return (
    <div className="flex justify-center my-10 ">
      {feed && <UserCard user={feed[0]} cardFooter={CardFooterButton} />}
    </div>
  );
};

const CardFooterButton = () => {
  return (
    <div className="card-actions justify-center items-center my-2">
      <button className="btn  btn-primary">Ignore</button>
      <button className="btn  btn-secondary">Interested</button>
    </div>
  );
};

export default Feed;
