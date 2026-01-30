import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", {
      username,
      email,
      password,
    });

    navigate("/login");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen flex flex-col justify-center items-center gap-4"
    >
      <input
        placeholder="Username"
        className="border p-2"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        className="border p-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-black text-white px-6 py-2">
        Register
      </button>
    </form>
  );
};

export default Register;
