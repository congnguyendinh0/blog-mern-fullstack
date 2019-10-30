import React, { useState } from 'react';
import { Button, InputLabel, Input, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { } from '@material-ui/icons/Menu';
import Axios from 'axios';
import { Redirect } from 'react-router-dom'


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  }
})

export default function Settings() {
  const classes = useStyles()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar,setAvatar]=useState('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [redirect, setRedirect] = useState('')

  const settings = async () => {
    await Axios({
      method: 'PUT',
      url: `http://localhost:5000/api/auth/settings`,

      headers:{
        'x-auth-token': `${localStorage.getItem('token')}`
      },
      data: {
        email: email,
        password: password,
        bio: bio,
        name: name,
        avatar:avatar

      }
    }).then(res => {
      console.log(res);
      setRedirect(true)
    }).catch(err => {
      console.log(err);
    })
  }

  if (redirect) {
    return <Redirect to="/" />
  }

  return (
    <div className={classes.root}>
      <h2>Settings</h2>
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input id="name" type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input id="email" type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input id="password" type="password" autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      

      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="name">Avatar</InputLabel>
        <Input id="avatar" type="text"
          onChange={(e) => setAvatar(e.target.value)}
        />
      </FormControl>

      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="bio">Bio</InputLabel>
        <Input id="bio" type="text"
          onChange={(e) => setBio(e.target.value)}
        />
      </FormControl>


      <Button variant="contained" color="primary" size="medium" onClick={settings}>
        save
        </Button>
    </div>
  )
}

