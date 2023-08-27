import React from "react";
import { Link } from "react-router-dom";
import PostList from "../Posts/postsList";
import AddPost from "../Posts/addPost";
import Users from "../Users/usersList";

const Header = () => {
  return (
    <>
      <div>
        <h1>Redux Toolkit</h1>
        <ul>
          <li>
            <Link to="/" element={<PostList />}>
              Post List
            </Link>
          </li>
          <li>
            <Link to="/post" element={<AddPost />}>
              Add Post
            </Link>
          </li>
          <li>
            <Link to="/user" element={<Users />}>
              Users List
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
