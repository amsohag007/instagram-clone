import React,{useState,useEffect} from 'react';
import './App.css';
import { auth, db } from './firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

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
  //modal-signUp
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);


  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
// login state management
  const [user,setUser]=useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in
      //  console.log(authUser);
        setUser(authUser);

      }else{
        //user has logged out
        setUser(null)
      }
    }) 
    return () => {
      //cleanup action
      unsubscribe();  
    }
  }, [user,username])//any time they change reload

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
      console.log("connected");
      setPosts(snapshot.docs.map( doc =>({
        id:doc.id,
        post:doc.data()
        
      })));
      console.log("data fetched");
      
    })
  }, []) 
  console.log(id);
  //firebase user authentication
  const signUp=(e)=>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
          return authUser.user.updateProfile({
            displayName:username
          })
        })
        .catch((error)=>alert(error.message));

    setOpen(false);

  }
  const signIn = (e) => {
    e.preventDefault();
    
    auth
     .signInWithEmailAndPassword(email,password)
     .catch((error)=>alert(error.message))
    
    setOpenSignIn(false);
  }

// rendering part.......................................................................
  return (

    <div className="App">
{/* .......................signup Modal.................................................. */}
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
    {/* .......................signIn Modal.................................................. */}
      </Modal>
      {/* //signIn modal */}
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
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
              <Button type="submit" onClick={signIn}>Sign In</Button>
           
          </form>
          
         </div>
      </Modal>
{/* .......................App Header section.................................................. */}
      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instsgram logo"
        />
        {user?(
          <Button onClick={()=>auth.signOut()}>Log Out</Button>
          ):(
            <div className="app__loginConatainer">
              <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={()=>setOpen(true)}>Sign Up</Button>
            </div>
          
        )}
      </div>

  {/* .......................Posts section.................................................. */}    
  {
                user?.displayName?(
                  <ImageUpload username={user.displayName}/>
                ):(
                  <h3>Sorry you have to log in to upload</h3>
                )
  }

      <div className="app__post">

      <div className="app__postLeft">
      {
          posts.map(({id,post})=>(
          
            <div>
              <Post 
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl} 
              />
            </div>

          ))
        }
      </div>

      <div className="app__postRight">
        <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      </div>
        
      </div>
      
    </div>
  );
}

export default App;
