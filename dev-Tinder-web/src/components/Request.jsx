import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Request = () => {
  const dispatch = useDispatch();
  const request = useSelector((store) => store.request);

  const fetchUserRequests = async () => {
    try {
      const requests = await axios.get(`${BASE_URL}/user/request/receive`, {
        withCredentials: true,
      });

      dispatch(addRequest(requests.data.data));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleRequestReview = async (action, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${action}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(userId));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchUserRequests();
  }, []);

  if (!request) return;

  if (request.length === 0) {
    return (
      <div className="p-2 flex justify-center flex-col items-center">
        <h2 className="card-title mb-3">No requets received yet...</h2>
      </div>
    );
  }

  const CardFooterButton = (userId) => {
    return (
      <div className="card-actions justify-center items-center my-2">
        <button
          className="btn  btn-primary"
          onClick={() => handleRequestReview("accepted", userId)}
        >
          Accept
        </button>
        <button
          className="btn  btn-secondary"
          onClick={() => handleRequestReview("rejected", userId)}
        >
          Reject
        </button>
      </div>
    );
  };

  return (
    <div className="p-2 flex justify-center flex-col items-center">
      <h2 className="card-title mb-3">Requests</h2>

      <div className="grid grid-cols-3 gap-4">
        {request &&
          request.map((request) => {
            return (
              <UserCard
                user={request.fromUserId}
                key={request._id}
                cardFooter={CardFooterButton}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Request;
