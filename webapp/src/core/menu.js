/* eslint-disable no-restricted-globals */
import React from "react";
import { Link } from "react-router-dom";
import Home from "./Home";
import {
    useLocation,
    useNavigate,
    useParams,
  } from "react-router-dom";
  
  function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      return (
        <Component
          {...props}
          router={{ location, navigate, params }}
        />
      );
    }
  
    return ComponentWithRouterProp;
  }

const currentTab = (location, path) => {
  if (location.pathname === path) {
    return { color: "#2ecc72" };
  } else {
    return { color: "#FFFFFF" };
  }
};
function Menu(props) {
    console.log(props)
  return (
    <div>
      <ul className="nav nav-tabs bg-dark">
        <li className="nav-item">
          <Link
            style={currentTab(props.router.location, "/")}
            className="nav-link"
            to="/"
          >
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(props.router.location, "/cart")}
            className="nav-link"
            to="/cart"
          >
            Cart
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(props.router.location, "/user/dashboard")}
            className="nav-link"
            to="/user/dashboard"
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(props.router.location, "/admin/dashboard")}
            className="nav-link"
            to="/admin/dashboard"
          >
            Admin Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(props.router.location, "/signup")}
            className="nav-link"
            to="/signup"
          >
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link
            style={currentTab(props.router.location, "/signin")}
            className="nav-link"
            to="/signin"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default withRouter(Menu);
