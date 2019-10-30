import React,{useState} from 'react';
import {  Button,InputLabel,Input,FormControl, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {}from '@material-ui/icons/Menu' ;
import Axios from 'axios';


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        border:1,
    }
})

export default function PostComment (){
  const classes = useStyles()
  const [ text, setText ] = useState('asodjaoisdjoias')

  const postcomment = async() => {
    console.log(text);
    await Axios({
      method: 'POST',
      url: `http://localhost:5000/api/posts/comment/5db1087003770f0d21fe8b6d`,
      data: {
        text:text
      },
      headers: {
        'x-auth-token': `${localStorage.getItem('token')}`
      }
    }).then(res => {
      console.log(res);
      setText('')
    }).catch(err => {
      console.log(err);
    })
  }
    return (
        <div className={classes.root}>
        <TextField id="text" type="text" value={text}
            onChange={(e) => setText(e.target.value)}/>
        <Button variant="contained" color="primary" size="medium" onClick={postcomment}>
          post
        </Button>
        </div>
    )
}