import { Card, CardHeader, Avatar, IconButton, CardContent, CardActions, Button, Badge } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import Axios from 'axios'


function createMarkup(post) {
  return {
    __html: `${post.text}`
  }
}

export default function ArticleCard(props) {
  const { post, user } = props // post.likes and user._id
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(null)
  useEffect(() => {
    if (post) {
      setLikeCount(post.likes.length)

    }
  }, [])
  useEffect(() => {
    checkAlreadyLiked()
  }, [liked, user])

  const checkAlreadyLiked = async () => {
    if (user && post) {
      let alreadyLikes = post.likes.forEach((obj) => {

        if (obj.user === user._id) {
          setLiked(true)
        }
      })
      console.log(alreadyLikes)
    }
  }

  const like = async () => {
    console.log('like')

    await Axios({
      method: 'PUT',
      url: `http://localhost:5000/api/posts/like/${post._id}`,
      headers: {
        'x-auth-token': `${localStorage.getItem('token')}`
      }
    }).then(res => {
      setLiked(true)
      setLikeCount(likeCount + 1)
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  //   setTimeout(() => {
  //     window.location.reload()
  //   }, 2000)
  }

  const dislike = async () => {
    console.log('dislike')

    await Axios({
      method: 'PUT',
      url: `http://localhost:5000/api/posts/unlike/${post._id}`,
      headers: {
        'x-auth-token': `${localStorage.getItem('token')}`
      }
    }).then(res => {
      setLiked(false)
      setLikeCount(likeCount - 1)
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
    // setTimeout(() => {
    //   window.location.reload()
    // }, 1000)
  }

  const showLike = liked ? (
    <div>
      <Badge badgeContent={likeCount} color="primary">
        <IconButton onClick={dislike}>
          <FavoriteIcon color="secondary"></FavoriteIcon>
        </IconButton>
      </Badge>
    </div>
  ) : (
      <div>
        <Badge badgeContent={likeCount} color="primary">
          <IconButton onClick={like}>
            <FavoriteIcon color="primary"></FavoriteIcon>
          </IconButton>
        </Badge>
      </div>
    )
  return (
    <div>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={post.user.avatar}

            />
          }
          action={
            showLike
          }
          title={post.title}
          subheader={
            <Link to={`/profile/${post.user._id}`}>
              {post.user.name}
            </Link>
          }

        />
        <CardContent>
          <div dangerouslySetInnerHTML={createMarkup(post)}></div>
        </CardContent>
        <CardActions>
          <Link to={`/posts/${post._id}`}>
            <Button>
              Read more!
                  </Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}