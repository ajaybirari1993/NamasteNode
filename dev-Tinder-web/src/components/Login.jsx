import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [userName, setUserName] = useState("ajaypatil@gmail.com");
  const [password, setPassword] = useState("Ajay@1993");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          email: userName,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card card-side bg-base-300 shadow-sm flex justify-center my-5 mx-auto w-[500px]">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
          alt="Movie"
        />
      </figure>

      <div className="card-body flex">
        <h2 className="card-title">Login</h2>

        <section className="flex flex-col gap-2.5">
          {/* UserName */}
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="email"
              required
              placeholder="Username"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>

          {/* Password */}
          <label className="input validator">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </g>
            </svg>
            <input
              type="password"
              required
              placeholder="Password"
              minLength="8"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </section>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleLoginClick}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
