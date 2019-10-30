import React,{useState} from 'react';
import {Button,TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {}from '@material-ui/icons/Menu' ;
import Axios from 'axios';
import { Redirect } from "react-router-dom";


const useStyles = makeStyles({
    root: {
        flexGrow: 1
    }
})

export default function Newpost (){
  const classes = useStyles()
  const [redirect, setRedirect] = useState('')
  const [ tags, setTags ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ text, setText] = useState('')

  const newpost = async() => {
    console.log(tags, title,text);
    let splitted = []
    splitted = tags.replace(/ /g,"").split(",")
    await Axios({
      method: 'POST',
      url: `http://localhost:5000/api/posts`,
      headers: {
          'x-auth-token': `${localStorage.getItem('token')}`
      },
      data: {
        text: text,
        tags: splitted,
        title:title
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
            <h2>Create New Post</h2>

        <TextField   fullWidth label="title" variant="outlined" onChange={(e) => setTitle(e.target.value)}></TextField>
        <TextField multiline rows={3}  fullWidth label="text" variant="outlined" onChange={(e) => setText(e.target.value)}></TextField>
        <TextField   fullWidth label="tags" variant="outlined" onChange={(e) => setTags(e.target.value)}></TextField>

        <Button variant="contained" color="primary" size="medium" onClick={newpost}>
          send
        </Button>
        </div>
    )
}
