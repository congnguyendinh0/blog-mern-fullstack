import React,{useState,useEffect} from 'react';
import {  Button,InputLabel,Input,FormControl,Card,CardHeader,Avatar,IconButton, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Axios from 'axios';
import { Redirect } from 'react-router-dom'
import { Tabs, Tab } from '@material-ui/core'
import ArticleCard from '../posts/ArticleCard'




export default function Profile (props){
  const { authUser, configAuth } = props
  const [ value, setValue ] = useState(1) // global feed
  const [ posts, setPosts ] = useState(null)
  const [ favorites, setFavorites ] = useState(null)
  const [ user, setUser ] = useState(null)
  const [link,setLink]= useState(null)
  const [ followed, setFollowed ] = useState(false) // for follow button
  useEffect(() => {
    fetchProfile()
  }, [])
  useEffect(() => {
    checkFollows()
  }, [user])
  useEffect(() => {

  }, [followed])

  const checkFollows = () => {
    if (authUser && user) {
      if (authUser.follow.includes(user._id)) {
        setFollowed(true)
      } else {
        setFollowed(false)
      }
    }
  }
  const fetchProfile = async () => {
    // fetch Post
    let url = window.location.href,
      profileurl = url.indexOf('profile/') + 8,
        idURL = url.substring(profileurl, url.length)

        setLink(idURL)
    await Axios({
      method: 'GET',
      url: `http://localhost:5000/api/users/user/${idURL}`,
      headers: {
        'x-auth-token': `${localStorage.getItem('token')}`
      }
    }).then(res => {
      console.log(res)
      configUser(res)
    }).catch(err => {
      console.log(err)
    })

    await Axios({
      method: 'GET',
      url: `http://localhost:5000/api/posts/user/${idURL}`,
      headers: {
        'x-auth-token': `${localStorage.getItem('token')}`
      }
    }).then(res=>{
      setPosts(res.data)
    }).catch(err=>{console.log(err)})

    await Axios({
      method:'GET',
      url:`http://localhost:5000/api/posts/likedposts/${idURL}`,
      headers:{
        'x-auth-token': `${localStorage.getItem('token')}`
      }
    }).then(res=>{
      setFavorites(res.data)
    }).catch(err=>{console.log(err)})
  }

  const follow =async()=>{
    await Axios({
      method:'POST',
      url:`http://localhost:5000/api/users/follow/${link}`,
      headers:{
        'x-auth-token': `${localStorage.getItem('token')}`
      },
      // TODO: fix sending body
      data: {
        userid: authUser._id
      }
    }).then(res => {
      console.log(res)
      // change followed state for already following button
      setFollowed(true)
      configAuth()
    }).catch(err => {
      console.log(err)
    })
  }

  const unfollow = async() => {
    await Axios({
      method: 'DELETE',
      url:`http://localhost:5000/api/users/unfollow/${link}`,
      headers:{
        'x-auth-token': `${localStorage.getItem('token')}`
      },
      data: {
        userid: authUser._id
      }
    }).then(res => {
      console.log(res)
      // change followed state for already following button
      setFollowed(false)
      configAuth()
    }).catch(err => {
      console.log(err)
    })
  }
 
  const configUser = (res) => {
    setUser(
      {
        _id: res.data._id,
        avatar: res.data.avatar,
        name: res.data.name,
        follow: res.data.follow,
        bio: res.data.bio
      }
    )
  }

  const showFollowButton = !followed ? (
    <IconButton onClick={follow} color="primary">
      <Icon>									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M10 8c1.66 0 2.99-1.34 2.99-3S11.66 2 10 2 7 3.34 7 5s1.34 3 3 3zm-6 2V8h2V6H4V4H2v2H0v2h2v2h2zm6 0c-2.33 0-7 1.17-7 3.5V16h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>								</Icon>
    </IconButton>
  ): (
    <IconButton onClick={unfollow} color="secondary">
      <Icon>									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M10 8c1.66 0 2.99-1.34 2.99-3S11.66 2 10 2 7 3.34 7 5s1.34 3 3 3zm-6 2V8h2V6H4V4H2v2H0v2h2v2h2zm6 0c-2.33 0-7 1.17-7 3.5V16h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>								</Icon>
    </IconButton>
  )

  const showProfile = user ? (
    <div>
          <Card>
          <CardHeader

          subheader={user.bio}
          
          avatar={
            <Avatar
              src={user.avatar}

            />
          }
          
          title={user.name}
          
         action={
           <div>
             {showFollowButton}
           </div>
         }

          

        />

  
          </Card>
        </div>
  ) : ''



  

  const showMyPosts = (value === 1 && posts) ? (
    <div>
        <h1>My Posts</h1>
        {
            posts.map(post => {
                return (
                    <ArticleCard post={post} key={post._id} user={user}/>
                )
            })
        }
    </div>
) : ''

const showFavorites = (value === 0 && favorites) ? (
  <div>
        <h1>YO</h1>
        {
            favorites.map(post => {
                return (
                    <ArticleCard post={post} key={post._id} user={user}/>
                )
            })
        }
    </div>
): ''

const handleChange = (event, value) => {
  setValue(value)
}
  
    return (
      <div>
        <div>
          {showProfile}
        </div>
        <Tabs
           value={value} onChange={handleChange}>
                <Tab value={0} label="My Favorite"/>
                <Tab value={1} label="My Posts"/>
            </Tabs>
            {showMyPosts}
            {showFavorites}
      </div>
    )
}

