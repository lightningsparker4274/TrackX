import { useState } from "react";
import localforage from "localforage";

// eslint-disable-next-line react/prop-types
const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const storedUser = await localforage.getItem("user");
    if (storedUser) {
      if (
        storedUser.username === username &&
        storedUser.password === password
      ) {
        setIsAuthenticated(true); // Successful login
      } else {
        alert("Incorrect username or password.");
      }
    } else {
      alert("No registered user found.");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm shadow-xl w-80"
      >
        <h2 className="mb-4 text-xl font-bold">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username:</label>
          <input
            required
            type="text"
            className="w-full p-2 border rounded outline-none focus:ring-2 ring-blue-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            required
            type="password"
            className="w-full p-2 border rounded outline-none focus:ring-2 ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <span className="flex justify-center">
          Dont have account?
          <a className="text-blue-500 indent-1" href="/register">
              Register
          </a>
        </span>
      </form>
    </div>
  );
};

export default Login;
