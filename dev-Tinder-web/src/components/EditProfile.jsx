import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [bio, setBio] = useState(user.bio);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const handleSaveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/${user._id}`,
        {
          firstName,
          lastName,
          age,
          gender,
          bio,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 4000);
      }
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  return (
    <div className="flex mx-10 gap-3 justify-center my-10">
      <div className="p-3 card  bg-base-300 w-[300px] ">
        <h2 className="card-title justify-center mx-3">Edit Profile</h2>

        <div className="flex  flex-col gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">First tName</legend>
            <input
              type="text"
              className="input"
              placeholder="first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Last tName</legend>
            <input
              type="text"
              className="input"
              placeholder="last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Age</legend>
            <input
              type="text"
              className="input"
              placeholder="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Gender</legend>
            <input
              type="text"
              className="input"
              placeholder="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Bio</legend>
            <textarea
              className="textarea h-24"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </fieldset>
        </div>

        <p className="text-red-500">{error}</p>
        <div className="card-actions justify-center mt-2.5">
          <button className="btn btn-primary" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      </div>

      <UserCard user={{ firstName, lastName, age, gender, bio }} />

      {showToast && (
        <div className="toast toast-top toast-end z-20">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
