import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import UserCard from "./UserCard";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchUserConnection = async () => {
    try {
      const connections = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      dispatch(addConnections(connections.data.data));
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchUserConnection();
  }, []);

  if (!connections) return;

  if (connections.length === 0) {
    return (
      <div className="p-2 flex justify-center flex-col items-center">
        <h2 className="card-title mb-3">No Connections yet...</h2>
      </div>
    );
  }

  return (
    <div className="p-2 flex justify-center flex-col items-center">
      <h2 className="card-title mb-3">Connections</h2>

      <div className="grid grid-cols-3 gap-4">
        {connections &&
          connections.map((connection) => {
            return <UserCard user={connection} />;
          })}
      </div>
    </div>
  );
};

export default Connections;
