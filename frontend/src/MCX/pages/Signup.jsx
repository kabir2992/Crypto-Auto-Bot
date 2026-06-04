import { useState } from "react";
import { signupUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signupUser(form);
      navigate("/");
    } catch {
      alert("Signup Failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">

      <div className="w-96 p-6 bg-orange-900/20 rounded-2xl space-y-3">

        <h1 className="text-2xl font-bold">Create Account</h1>

        {["firstName", "email", "password"].map((f) => (
          <input
            key={f}
            placeholder={f}
            type={f === "password" ? "password" : "text"}
            className="w-full p-2 bg-black border border-orange-500"
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
          />
        ))}

        <button
          onClick={handleSignup}
          className="w-full bg-orange-600 py-2 rounded-xl"
        >
          Signup
        </button>

      </div>
    </div>
  );
}