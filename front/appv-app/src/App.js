import { withRouter } from 'react-router-dom';
import axios from "axios";
import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import {Card, Image} from 'react-bootstrap';
import './App.css';
function App() {
    const [login, setLogin] = useState(false);
    const [data, setData] = useState({});
    const [picture, setPicture] = useState('');
    const [accessToken, setAccessToken] = useState(false);
    const [posts, setPosts] = useState([]);

    const responseFacebook = async (response) => {
        try {
            setData(response);
            setPicture(response.picture.data.url);
            if (response.accessToken) {
                setAccessToken(response.accessToken);
                setLogin(true);
                const posts = await getTopPosts(response.accessToken);
                setPosts(posts.posts);
            } else {
                setLogin(false);
            }
        } catch (e) {
            console.log('oopsic.');
        }
    }

    const getTopPosts = async (accessToken) => {
        try {
            const response = await axios.get('http://localhost:3000/fb/topPosts/'+accessToken);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="container">
            <Card style={{ width: '600px' }}>
                <Card.Header>
                    { !login &&
                    <FacebookLogin
                        appId="4142782292438877"
                        autoLoad={true}
                        fields="name,email,picture"
                        scope="public_profile,page_events,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,pages_manage_engagement"
                        callback={responseFacebook}
                        icon="fa-facebook" />
                    }
                    { login &&
                    <Image src={picture} roundedCircle />
                    }
                </Card.Header>
                { login &&
                <Card.Body>
                    <Card.Title>{data.name}</Card.Title>
                    <Card.Text>
                        {data.email}
                    </Card.Text>
                </Card.Body>
                }
            </Card>
            <Card style={{ width: '600px' }}>
                <Card.Body>
                    {posts.map((value, postIndex) => {
                        return <li key={postIndex}>ID: {value.id},Likes: {value.likes}, Shares: {value.shares}, Total: {value.total}, link: <a href={value.link} target='_blank'>Click</a></li>
                    })}
                </Card.Body>
            </Card>
        </div>
    );
}

export default withRouter(App);
