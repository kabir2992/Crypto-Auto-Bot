import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      navigate("/");
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="w-96 p-6 bg-orange-900/20 rounded-2xl space-y-4">

        <h1 className="text-2xl font-bold">MCX AI Login</h1>

        <input
          className="w-full p-2 bg-black border border-orange-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 bg-black border border-orange-500"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-orange-600 py-2 rounded-xl"
        >
          Login
        </button>

      </div>
    </div>
  );
}