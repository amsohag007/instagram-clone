import React,{useState,useEffect} from 'react';
import './App.css';
import { db } from './firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))


function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open,setOpen]=useState(false);

  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot=>{
      console.log("connected");
      setPosts(snapshot.docs.map( doc =>({
        id:doc.id,
        post:doc.data()
        
      })));
    })
  }, []) 

  const signUp=(e)=>{
    e.preventDefault();

  }


  return (
    <div className="App">

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
         <div style={modalStyle} className={classes.paper}>

          <form className="app__signUp">
            <center>
              <img 
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt="instsgram logo"
              />
            </center>
              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input 
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>Sign Up</Button>
           
          </form>
          
         </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instsgram logo"
        />
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
      </div>
      
      {
        posts.map(({id,post})=>(
          <Post 
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl} 

          />
        ))
      }

    </div>
  );
}

export default App;
