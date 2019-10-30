import React,{useState,useEffect} from 'react';
import {  Button,InputLabel,Input,FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Axios from 'axios';
import { Redirect } from 'react-router-dom'


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    }
})

export default function Login (props){
  const classes = useStyles()
  const { configAuth } = props
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [log,setLogin]=useState('')
  useEffect(() => {

  }, [log]
  )

  const login = async() => {
    console.log(email, password);
    await Axios({
      method: 'POST',
      url: `http://localhost:5000/api/auth`,
      data: {
        email: email,
        password: password
      }
    }).then(res => {
      console.log(res);
      localStorage.setItem('token', res.data.token)
      setLogin(true)
      configAuth()
    }).catch(err => {
      console.log(err);
    })
  }


  if (log) {
    return <Redirect to="/" />
  }



    return (
        <div className={classes.root}>
            <h2>Login</h2>
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

        <Button variant="contained" color="primary" size="medium" onClick={login}>
          login
        </Button>
        </div>
    )
}

