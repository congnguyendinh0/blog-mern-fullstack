import React from 'react';
import { AppBar,Button, IconButton, Icon} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    }
})

const Navbar = (props) => {
    const { user, setUser } = props
    const classes = useStyles()
    const logout = ()=>{
        localStorage.removeItem('token')
        setTimeout(()=>{
            window.location.reload()
        },500)
    }
    const showIfUserlogged = user ? (
        <div>
            <Link to="/">
                <Button>
                    Home
                </Button>
            </Link>
            <Link to="/newpost">
                <Button>
                    Add
                </Button>
            </Link>
            <Link to="/settings">
                <Button>
                    Setting
                </Button>
            </Link>
            <Link to={`/profile/${user._id}`}>
                <Button>
                    Profile
                </Button>
            </Link>
            <Button onClick={logout}>
                Logout
            </Button>
        </div>
    ) : (
        <div>
            <Link to="/login">
                <Button>
                    Login
                </Button>
            </Link>
            <Link to="/register">
                <Button>
                    Register
                </Button>
            </Link>
        </div>
    )

    return (
        <div className={classes.root}>
            <AppBar
                position="static"           
            >
                <div>
                    {showIfUserlogged}
                </div>
            </AppBar>
        </div>
    )
}

export default Navbar;  
