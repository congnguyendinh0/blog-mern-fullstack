import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";
import { Chip } from "@material-ui/core";
import Axios from "axios";
import {
  Button,
  InputLabel,
  Input,
  FormControl,
  CircularProgress
} from "@material-ui/core";
import Comment from "./Comment";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  tag: {
    flex: "0 1 calc(33% 3px)",
    margin: "3px"
  },
  tags: {
    display: "flex",
    flexFlow: "row wrap",
    margin: "1em auto"
  }
});

function createMarkup(post) {
  return {
    __html: `${post.text}`
  };
}

export default function Post(props) {
  const { id, user } = props; // post ID
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [edit, setEdit] = useState(false);
  const classes = useStyles();

  // occurs, when component mounts
  useEffect(() => {
    fetchPost();
  }, []);
  useEffect(() => {}, [post]);
  useEffect(() => {}, [deleted]);
  useEffect(() => {}, [edit]);
  const fetchPost = async () => {
    // fetch Post
    await Axios({
      method: "GET",
      url: `http://localhost:5000/api/posts/${id}`,
      headers: {
        "x-auth-token": `${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        console.log(res);
        setPost(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deletedpost = async postId => {
    await Axios({
      method: "DELETE",
      url: `http://localhost:5000/api/posts/${postId}`,
      headers: {
        "x-auth-token": `${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        setDeleted(true);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const editpost = async postId => {
    await Axios({
      method: "GET",
      url: ` http://localhost:5000/api/posts/${postId}`,
      headers: {
        "x-auth-token": `${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        setEdit(true);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  function checkUser(post, user) {
    if (!post && !user) {
      return "";
    } else if (user && post) {
      if (post.user._id === user._id) {
        return (
          <div>
            <IconButton onClick={() => deletedpost(post._id)}>
              <DeleteIcon></DeleteIcon>
            </IconButton>

            <Link to={`/editpost/${post._id}`}>
              <IconButton onClick={() => editpost(post._id)}>
                <EditIcon></EditIcon>
              </IconButton>
            </Link>
          </div>
        );
      }
    }
  }

  const showDeleteEditButton = checkUser(post, user);

  const showPosts = !post ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <div>
      <Card>
        <CardHeader
          avatar={<Avatar src={post.user.avatar} />}
          action={
            <div>
              <IconButton onClick={() => console.log("clicked")}>
                <FavoriteIcon></FavoriteIcon>
              </IconButton>
              {showDeleteEditButton}
            </div>
          }
          title={post.title}
          subheader={<Link to={`/profile/${post.user._id}`}>{post.name}</Link>}
        />
        <CardContent>
          <div dangerouslySetInnerHTML={createMarkup(post)}></div>
          {post.tags.map(tag => {
            return <Chip className={classes.tag} key={tag} label={tag} />;
          })}
        </CardContent>
      </Card>
    </div>
  );

  const showComments = !post ? (
    <div>
      <h1>Loading . . .</h1>
    </div>
  ) : (
    <div>
      {post.comments.map(comment => {
        return (
          <Comment
            comment={comment}
            post={post}
            fetchPost={fetchPost}
            user={user}
          />
        );
      })}
    </div>
  );

  const postcomment = async () => {
    console.log(text);
    await Axios({
      method: "POST",
      url: `http://localhost:5000/api/posts/comment/${post._id}`,
      data: {
        text: text
      },
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

  const showNewComment = !post ? (
    <div>
      <h1>Loading . . .</h1>
    </div>
  ) : (
    <div>
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="text">comment</InputLabel>
        <Input id="text" type="text" onChange={e => setText(e.target.value)} />
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={postcomment}
      >
        post
      </Button>
    </div>
  );

  if (deleted) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      {showPosts}
      {showComments}
      {showNewComment}
    </div>
  );
}
