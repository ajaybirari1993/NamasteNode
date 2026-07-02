import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed } from "../utils/feedSlice";
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

  const handleRequestSend = async (action, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${action}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeed(userId));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getfeed();
  }, []);

  if (!feed) return;

  if (feed.length === 0) {
    return (
      <div className="card-actions justify-center items-center my-2">
        <h2 className="card-title mb-3">No new connections yet...</h2>
      </div>
    );
  }

  const CardFooterButton = (userId) => {
    return (
      <div className="card-actions justify-center items-center my-2">
        <button
          className="btn  btn-primary"
          onClick={() => handleRequestSend("ignored", userId)}
        >
          Ignore
        </button>
        <button
          className="btn  btn-secondary"
          onClick={() => handleRequestSend("interested", userId)}
        >
          Interested
        </button>
      </div>
    );
  };

  return (
    <div className="flex justify-center my-10 ">
      {feed && <UserCard user={feed[0]} cardFooter={CardFooterButton} />}
    </div>
  );
};

export default Feed;
