import React,{useState, useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase';

function Post({postId,user, username,caption,imageUrl}) {
    const [comment,setComment]=useState('');
    const [comments,setComments]=useState([]);
  
    useEffect(() => {
        console.log("comment fecthing trigggered");
        let unsubscribe;
        if(postId){
            unsubscribe=db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc)=>doc.data()));
                    // console.log(snapshot.docs.map((doc)=>doc.data()));
                });
                console.log("comment fetched");
        }

        return () => {
            unsubscribe();
            console.log("comments fetching failed");
        };

    }, [postId])

    const postComment=(e)=>{
        e.preventDefault();
        console.log("posting comment=>connecting database");
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username: user.displayName
        });
        setComments('');
        console.log(comments.text);
    }

    return (
        <div className="post">
            <div className="post__header">
            <Avatar
                className="post__avatar"
                alt="Musa"
                src="/static/images/avatar/1.jpg"
            />
            <h3>{username}</h3>
            </div>
            <img 
            className="post__image "
            src={imageUrl}
            alt=""
            />

        <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
        
        <div className="post__comment">
            {
                comments.map((comment)=>(
                  <p>
                      <strong>{comment.username}</strong>: {comment.text}
                  </p>  
                ))
            }
        </div>


        <form className="post__commentBox">
            <input 
                className="post__input"
                type="text"
                placeholder="Add a comment.."
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
            />
            <button
                className="post__button"
                disabled={!comment}
                type="submit"
                onClick={postComment}
            >
            Post
            </button>
        </form>
        
        
        
        </div>
    )
}

export default Post
