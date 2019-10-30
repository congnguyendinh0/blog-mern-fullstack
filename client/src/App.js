import React, { useState, useEffect} from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'

import { makeStyles } from '@material-ui/styles';
import Login from './components/users/Login';
import Register from './components/users/Register';
import Newpost from './components/posts/Newpost';
import Postcomment from './components/posts/Postcomment'
import Post from './components/posts/Post'
import Home from './components/Home'
import Settings from './components/users/Settings'
import Axios from 'axios'
import EditPost from './components/posts/EditPost'
import Profile from './components/users/Profile'
const useStyles = makeStyles({
  root: {
   
  }
})

const App = () => {
  const classes = useStyles()
  const [ user, setUser ] = useState(null)
  const [ auth, setAuth ] = useState(false)

  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = async() => {
    await Axios({
        method: 'GET',
        url: 'http://localhost:5000/api/auth',
        headers: {
          'x-auth-token': `${localStorage.getItem('token')}`
        }
      }).then(res => {
        console.log(res)
        configUser(res)
        setAuth(true)
      }).catch(err => {
        console.log(err)
        setAuth(false)
      })
  }

  const configUser = (res) => {
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      avatar: res.data.avatar,
      follow: res.data.follow
    })
  }

  return (
    <Router>    
      <div>
      <Navbar user={user}/>
      <Switch>
        <Route exact path="/" render={() => <Home user={user} setUser={setUser}/>} />
        <Route path="/login" component={Login}/>
        <Route path="/settings" component={Settings}/>
        <Route path="/register" component={Register}/>
        <Route path="/newpost" component={Newpost}/>
        <Route path="/postcomment" component={Postcomment}/>
        <Route path="/posts/:id" render={({match}) => <Post id={match.params.id} user={user}/>}/>
        <Route path="/profile/:id" render={({match}) => <Profile authUser={user} id={match.params.id} configAuth={checkToken}/>}/>
        <Route path="/editpost/:id" render={({match}) => <EditPost id={match.params.id}/>}/>
      </Switch>
    </div>
    </Router>
  );
}
export default App



