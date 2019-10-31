import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  IconButton
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
export default function Comment(props) {
  const { comment, post, fetchPost, user } = props;
  useEffect(() => {}, []);

  const deleted = async comment => {
    await Axios({
      method: "DELETE",
      url: `http://localhost:5000/api/posts/comment/${post._id}/${comment}`,
      headers: {
        "x-auth-token": `${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log(res);
        fetchPost();
      })
      .catch(err => {
        console.log(err);
      });
  };

  function checkUser(comment, user) {
    if (!user && !comment) {
      return "";
    }
    if (user._id == comment.user._id) {
      return (
        <IconButton onClick={() => deleted(comment._id)}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
      );
    } else {
      return "";
    }
  }

  const showDelete = checkUser(comment, user);

  return (
    <Card>
      <CardHeader
        avatar={<Avatar src={comment.user.avatar} />}
        action={showDelete}
        title={comment.text}
        subheader={
          <Link to={`/profile/${comment.user._id}`}>{comment.user.name}</Link>
        }
      />
      <CardContent>
        <p>{comment.text}</p>
      </CardContent>
    </Card>
  );
}
