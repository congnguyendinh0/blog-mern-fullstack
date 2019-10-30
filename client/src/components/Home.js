import React, { useState, useEffect, useRef } from 'react'
import { Tabs, Tab , makeStyles, Chip} from '@material-ui/core'
import Axios from 'axios'
import ArticleCard from './posts/ArticleCard'

const useStyles = makeStyles({

})

export default function Home(props) {
    const classes = useStyles()
    const { user } = props
    const [ value, setValue ] = useState(1) // global feed
    const [ posts, setPosts ] = useState(null)
    const [ tag, setTag ] = useState(null)
    const [ tags, setTags ] = useState(null)
    const [ personalFeed, setPersonalFeed ] = useState(null) // personal feed

    useEffect(() => {
        fetchGlobal()
        
        return () => {
            console.log('clear home')
        }
    }, [])
    useEffect(() => {
        if (tag) {
            fetchByTag()
        }
    }, [tag])
    useEffect(() => {
        fetchPersonalFeed()
    }, [user])

    const fetchPersonalFeed = async() => {
        if (user) {
            let arr = []    
            user.follow.forEach(async(id) => {
                console.log(id)
                let url = `http://localhost:5000/api/posts/user/${id}`
                await Axios(
                    {
                        method: 'GET',
                        url: url,
                        headers: {
                            'x-auth-token': `${localStorage.getItem('token')}`
                        }
                    }
                ).then(res => {
                    console.log(res)
                    res.data.forEach(async(post) => {
                        arr.push(post)
                    })
                }).catch(err => {
                    console.log(err)
                })
            })
            setPersonalFeed(arr)
        }
    }
    const fetchGlobal = async() => {
        await Axios({
            method: 'GET',
            url: `http://localhost:5000/api/posts`,
            headers: {
                'x-auth-token': `${localStorage.getItem('token')}`
            }
        }).then(res => {
            console.log(res)
            setPosts(res.data)
        }).catch(err => {
            console.log(err)
        })
        await Axios({
            method: 'GET',
            url: 'http://localhost:5000/api/posts/tags',
            headers: {
                'x-auth-token': `${localStorage.getItem('token')}`
            }
        }).then(res => {
            console.log(res.data)
            setTags(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    

    const fetchByTag = async() => {
        let headersObj = {
            headers: {
                'x-auth-token': `${localStorage.getItem('token')}`
            }
        }
        let url = `http://localhost:5000/api/posts/getByTag?tag=${tag}`
        console.log(tag, 60, headersObj)
        
        await Axios({
            method: 'GET',
            url: url, 
            headers: headersObj
        }).then(res => {
            console.log(res.data)
            setPosts(res.data)
        }).catch(err => {
            console.log(err)
        })

    }

    const showGlobal = (value === 1 && posts) ? (
        <div>
            <h1>GLOBAL</h1>
            {
                posts.map(post => {
                    return (
                        <ArticleCard post={post} key={post._id} user={user}/>
                    )
                })
            }
        </div>
    ) : (
        <div>
            
        </div>
    )


    const showPersonalFeed = (value === 0 && personalFeed) ? (
        <div>
        {personalFeed.map(post => {
            return (
                <ArticleCard post={post} key={post._id} user={user}/>
            )
        })}
        </div>
    ): (
        <div>

        </div>
    )
    const showTags = tags ? (
        <div>
            {
                tags.map(tag => {
                    return (
                        
                        <Chip key={tag} label={tag} onClick={() => setTag(tag)}/>
                    )
                })
            }
        </div>
    ) : (
        <div>

        </div>
    )

    const handleChange = (event, value) => {
        setValue(value)
    }

    return (
        <div>
            <div>
                {showTags}
            </div>
            <Tabs value={value} onChange={handleChange}>
                <Tab value={0} label="Personal"/>
                <Tab value={1} label="Global"/>
            </Tabs>
            {showGlobal}
            {showPersonalFeed}
        </div>
    )    
}