
import React, { useState } from 'react';
import { Button, InputLabel, Input, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { } from '@material-ui/icons/Menu';
import Axios from 'axios';
import { Redirect } from "react-router-dom";


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  }
})

export default function Register(props) {
  const classes = useStyles()
  const { configAuth } = props
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('')

  const register = async () => {
    console.log(name, email, password);
    await Axios({
      method: 'POST',
      url: `http://localhost:5000/api/users`,
      data: {
        email: email,
        name: name,
        password: password
      }
    }).then(res => {
      console.log(res);
      localStorage.setItem('token', res.data.token)
      setRedirect(true)
      configAuth()
    }).catch(err => {
      console.log(err);
    })
  }



  if (redirect) {
    return <Redirect to="/" />
  }
  return (
    <div className={classes.root}>
      <h2>Register</h2>
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input id="name" type="text" autoComplete="current-name"
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

      <Button variant="contained" color="primary" size="medium" onClick={register}>
        register
        </Button>
    </div>
  )
}

