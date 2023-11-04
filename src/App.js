import "./App.css";
import Navbar from "./components/Navbar";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { Modal } from "@mui/material";
import { makeStyles } from "@mui/styles";
import InstagramEmbed from "react-instagram-embed";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%,-${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
  
  paper: {
    position: "absolute",
    width: 400,
    border: "2px solid #000",
    boxShadow: "0 16px 10px rgba(0, 0, 0, 0.12) !important", // Use boxShadow directly with !important
    padding: "16px", // You can use the number directly
    backgroundColor: "#fff",
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  // To Keep track on user if its logged in or not
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleSignup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        // Set the displayName after successful registration
        return authUser.user
          .updateProfile({
            displayName: username,
          })
          .then(() => {
            // At this point, the displayName should be set
            setUser(authUser); // Update the user state
          });
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    //for posts

    // Fetch data from Firestore and populate the 'posts' state
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className="App">
      <div className="app-header">
        <Navbar />

        {user ? (
          <>
            <Button onClick={() => auth.signOut()}>Log Out</Button>
          </>
        ) : (
          <div className="modals_signup_signin">
            <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={() => setOpen(true)}>SignUP</Button>
          </div>
        )}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div style={getModalStyle()} className={classes.paper}>
            <form className="ig_form">
              <center>
                <img
                  className="ig_img"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027"
                  alt="ista-log"
                />
                <Input
                  label="Username"
                  placeholder="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  label="Email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  placeholder="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  className="ig_btn"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </center>
            </form>
          </div>
        </Modal>
        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div style={getModalStyle()} className={classes.paper}>
            <form className="ig_form">
              <center>
                <img
                  className="ig_img"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png?20160616034027"
                  alt="ista-log"
                />

                <Input
                  label="Email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Password"
                  placeholder="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  className="ig_btn"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={signIn}
                >
                  Sign In
                </Button>
              </center>
            </form>
          </div>
        </Modal>
      </div>
      <div className="app-posts">
        <div className="app-post-left">
          <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
                      clientAccessToken='123|456'

            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
            <div className="app-imgUpload">
        {user?.displayName ? (
          <ImageUpload username={user.displayName} userId={user.displayName} />
        ) : (
          <h3>Sorry, you have to set your display name to upload images.</h3>
        )}
      </div>
        </div>
        <div className="app-post-right">
          {posts.map(({ id, post }) => (
            // Check if 'post' object and its properties exist before rendering

            <Post
              key={id}
              user={user}
              caption={post.caption}
              userName={post.username}
              userId={post.userId}
              imgAv={post.imgAv}
              imageURL={post.imageURL}
            />
          ))}
        </div>
      </div>
    
    </div>
  );
}

export default App;
