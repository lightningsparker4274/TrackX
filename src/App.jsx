/* 
import { useState, useEffect } from "react";
//import {useNavigate} from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";
import MasterPage from "./component/MasterPage";
import localforage from "localforage";
import StoredData from "./component/StoredData";
import EditPage from "./component/EditPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localforage.getItem("user").then((user) => {
      if (user) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  return (
    <div className="font-base">
      <Router>
        <Routes>
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/protected" replace />
              ) : (
                <Register setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/protected" replace />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/protected"
            element={
              isAuthenticated ? (
                <MasterPage setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/protected" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Protect additional routes */}
          <Route
            path="/store"
            element={
              isAuthenticated ? <StoredData /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/files"
            element={
              isAuthenticated ? <EditPage /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
*/



import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";
import MasterPage from "./component/MasterPage";
import localforage from "localforage";
import StoredData from "./component/StoredData";
import EditPage from "./component/EditPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated
    localforage.getItem("user").then((user) => {
      if (user) {
        setIsAuthenticated(true);
      }
      setLoading(false); // Set loading to false after checking authentication
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other loading indicator
  }

  return (
    <div className="font-base">
      <Router>
        <Routes>
          {/* Default route logic */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/protected" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/protected" replace />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Register Route */}
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/protected" replace />
              ) : (
                <Register setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />

          {/* Protected Route - MasterPage */}
          <Route
            path="/protected"
            element={
              isAuthenticated ? (
                <MasterPage setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Protected Route - StoredData */}
          <Route
            path="/store"
            element={
              isAuthenticated ? <StoredData /> : <Navigate to="/login" replace />
            }
          />

          {/* Protected Route - EditPage */}
          <Route
            path="/files"
            element={
              isAuthenticated ? <EditPage /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
