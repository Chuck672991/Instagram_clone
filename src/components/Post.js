import React, { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import "./Post.css";
import { db } from "../firebase";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiNavigation } from "react-icons/bi";
import firebase from "firebase/compat/app";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";

function Post({ user, userName, imageURL, userId, imgAv, caption }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLiked = () => {
    setLiked(!liked);
  };
  const isSaved = () => {
    setSaved(!saved);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  useEffect(() => {
    let unsubscribe;
    if (userId) {
      unsubscribe = db
        .collection("posts")
        .doc(userId)
        // .orderBy("timestamp","desc")
        .collection("comments")
        .onSnapshot((snapshot) => {
          console.log("Snapshot:", snapshot.docs);

          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe if it was defined
      }
    };
  }, [userId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(userId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post_av_us">
        <img src={imgAv} alt="avatar" />
        <h3>{userName}</h3>
      </div>
      {/* image */}
      <div className="post_content">
        <img src={imageURL} alt="post-image" />
      </div>
      {/* like comment share buttons */}
      <div className="post_btns">
        <div className="post_btn" onClick={isLiked}>
          {liked ? <AiFillHeart className="post_like" /> : <AiOutlineHeart />}
        </div>
        <div className="post_btn">
          <FaRegComment className="cmnt" />
        </div>
        <div className="post_btn">
          <BiNavigation className="post_share" />
        </div>
        <div
          className="post_btn"
          onClick={isSaved}
          style={{ marginLeft: "auto" }}
        >
          {saved ? (
            <BsFillBookmarkFill className="post_save" />
          ) : (
            <BsBookmark />
          )}
        </div>
      </div>

      <div className="description">
        <span className="userName">{userId}</span>

        {showFullDescription || caption.length <= 100 ? (
          <span>{caption}</span>
        ) : (
          <>
            {caption.slice(0, 100)}
            <span onClick={toggleDescription} className="see-more">
              {" See More..."}
            </span>
          </>
        )}

        {showFullDescription && (
          <span onClick={toggleDescription} className="see-more">
            See less
          </span>
        )}
      </div>

      <form className="comment-form">
        <input
          className="comment_input"
          type="text"
          placeholder="Enter your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={postComment}
          disabled={!comment}
          className="comment_post_btn"
          type="submit"
        >
          Submit
        </button>
      </form>
      <div className="comments-dropdown">
        <FaAngleDown
          onClick={toggleComments}
          className="comment-toggle-button"
        /> {showComments ? <span></span> : <span style={{color: "grey",marginLeft:"10px"}}> Show Comments</span>}
      
      </div>

      {/* Comments container */}
      <div className={`post-comments ${showComments ? "open" : "closed"}`}>
        {comments.length > 0 ? (
          <div className="comment-list">
            {comments.map((comment, index) => (
              <p key={index}>
                <strong>{comment.username}</strong> {comment.text}
              </p>
            ))}
          </div>
        ) : (
          <div className="no-comments">
            <span style={{ color: "grey" }}>No comments!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
