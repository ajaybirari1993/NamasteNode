const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, bio } = user;

  return (
    <div className="card bg-base-300 w-[300px] shadow-md">
      <figure>
        <img
          src={
            gender.toLowerCase() === "male"
              ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwFOT4lfR0-YPWFK5rkm4YU_AIFQSPzGyF8NHnFNO_UA&s=10"
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIYWkg9Nh_jRfYTDqkp_jTniVGjaCqmRZ03ooEoyIMxg&s=10"
          }
          alt="profile photo"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
        <p>
          {gender} &nbsp;
          {age}
        </p>
        <p>{bio}</p>
        <div className="card-actions justify-center items-center my-2">
          <button className="btn  btn-primary">Ignore</button>
          <button className="btn  btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
