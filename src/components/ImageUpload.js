import React, { useState } from "react";
import { Button } from "@mui/material";
import { storage, db } from "../firebase";
import firebase from "firebase/compat/app";
import "./imageUpload.css"
import "firebase/compat/auth";
import "firebase/compat/firestore";

function ImageUpload({ username, userId }) {
  const [caption, setCaption] = useState("");
  const [img, setImg] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!img || !caption) {
      alert("Please select an image and enter a caption.");
      return;
    }

    const uploadTask = storage.ref(`images/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(img.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageURL: url,
                username: username,
                userId: userId, // Set userId from the prop
              })
              .then(() => {
                setProgress(0);
                setCaption("");
                setImg(null);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
                alert("An error occurred while adding the document.");
              });
          });
      }
    );
  };

  return (
    <div className="imgUpload-main">
      <progress value={progress} max={100} className="iu-progress"/>
      <input
      className="iu_caption_input"
        type="text"
        placeholder="Enter Your Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <div className="flex-container">
<input type="file" onChange={handleChange} className="iu-input-file" id="imageInput" accept="image/*" style={{ display: "none" }} />
<label htmlFor="imageInput" className="iu-upload-btn">
{img ? img.name : "Select Image"}


</label>
      
      <Button className="upload_btn" onClick={handleUpload}>Upload</Button>
</div>

    </div>
  );
}

export default ImageUpload;
