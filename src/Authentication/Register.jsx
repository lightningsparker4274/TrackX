import { useState } from "react";
import localforage from "localforage";

// eslint-disable-next-line react/prop-types
const Register = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (username && password) {
      // Store the user credentials using localforage
      await localforage.setItem("user", { username, password });
      setIsAuthenticated(true); // Mark as authenticated
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="p-6 bg-white rounded shadow-md w-80"
      >
        <h2 className="mb-4 text-xl font-bold">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
