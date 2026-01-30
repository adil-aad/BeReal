import { useState, useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    login(res.data)  // Calls the context function to save the token/user to LocalStorage
    navigate("/")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen flex flex-col justify-center items-center gap-4"
    >
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
        Login
      </button>
    </form>
  )
}

export default Login
