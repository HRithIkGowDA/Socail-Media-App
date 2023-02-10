import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
function Post({ userName, photoURL, caption, imageURL, postID }) {
  const [moreButton, setMoreButton] = useState(false);
  const [{ user }] = useStateValue();

  const [likesOnPost, setLikesOnPost] = useState({
    likes: [],
  });

  const [likeState, setLikeState] = useState({
    like: likesOnPost?.likes.length > 0 ? likesOnPost?.likes.length : 0,
    likeActive: false,
  });

  const [commentsOnPost, setCommentsOnPost] = useState([]);

  const [commentState, setCommentState] = useState({
    comments: commentsOnPost?.length > 0 ? commentsOnPost?.length : 0,
  });

  const [commentInput, setCommentInput] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const handleLike = async (e) => {
    e.preventDefault();

    if (likesOnPost?.likes.includes(user?.userName)) {
      // dislike Part
      const likePayload = {
        likes: likesOnPost?.likes.filter((likedUser) => {
          return likedUser !== user?.userName;
        }),
      };

      await setDoc(doc(db, "likes", postID), likePayload);

      setLikesOnPost({
        likes: likePayload.likes,
      });
    } else {
      // like Part
      const likePayload = {
        likes: [...likesOnPost.likes, user?.userName],
      };

      setLikesOnPost(likePayload);

      await setDoc(doc(db, "likes", postID), likePayload);

      setLikesOnPost({
        likes: likePayload.likes,
      });
    }
  };

  const getLikes = async () => {
    const docRef = doc(db, "likes", postID);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLikesOnPost(docSnap.data());
    }

    setLikeState({
      like: docSnap.data()?.likes?.length ? docSnap.data()?.likes?.length : 0,
      likeActive: docSnap.data().likes?.includes(user?.userName) ? true : false,
    });
  };

  useEffect(() => {
    getLikes();
  }, [likeState]);

  const handleComment = async (e) => {
    e.preventDefault();

    if (commentInput.length > 0) {
      let payload = {
        commentInput,
        userName: user?.userName,
        photoURL: user?.photoURL,
        timeStamp: serverTimestamp(),
      };

      const docRef = doc(db, "comments", postID);

      addDoc(collection(docRef, "list"), payload);

      setCommentInput("");
    } else {
      alert("Please Fill up the blank");
    }
  };

  const getComments = async () => {
    const q = query(
      collection(db, "comments", postID, "list"),
      orderBy("timeStamp", "desc")
    );

    onSnapshot(q, (snapshot) => {
      setCommentsOnPost(snapshot.docs);
      setCommentState({
        comments: snapshot.docs.length,
      });
    });
  };

  useEffect(() => {
    getComments();
  }, [commentState]);

  return (
    <Container>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <AllCommentContainer>
            {commentsOnPost.map((comment) => (
              <div className="post-comment">
                <div className="user-image">
                  <img src={comment.data().photoURL} alt="" />
                </div>
                <div className="user-comment">
                  <strong>{comment?.data().userName}</strong>
                  <p>{comment?.data().commentInput}</p>
                </div>
              </div>
            ))}
          </AllCommentContainer>
        </DialogContent>
      </Dialog>
      <UserInfo>
        <img src={photoURL} alt="" />
        <p>{userName}</p>
      </UserInfo>
      <Content>
        <img src={imageURL} alt="" />
      </Content>
      <PostCTA>
        <CTAButtons>
          {likeState.likeActive ? (
            <img src="./heart (1).png" alt="" onClick={handleLike} />
          ) : (
            <img src="./heart.png" alt="" onClick={handleLike} />
          )}
          <img src="./chat 1.png" alt="" onClick={() => setOpenDialog(true)} />
        </CTAButtons>
        <LikeCount>
          <p>{likesOnPost?.likes.length} likes</p>
        </LikeCount>
        <PostDescription moreButton={moreButton}>
          <h5>{caption}</h5>

          <div className="recent-comment">
            <strong>{commentsOnPost[0]?.data().userName}</strong>
            <p>{commentsOnPost[0]?.data().commentInput}</p>
          </div>

          <div className="description-buttons">
            <p onClick={() => setOpenDialog(true)}>view all comments</p>
            <p onClick={() => setMoreButton(!moreButton)}>
              {moreButton ? "less" : "more"}
            </p>
          </div>
        </PostDescription>
        <CommentInput>
          <input
            type="text"
            placeholder="Add Comment"
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
          />
          <button onClick={handleComment}>Post</button>
        </CommentInput>
      </PostCTA>
    </Container>
  );
}

const Container = styled.div`
  height: fit-content;
  width: 100%;
  border: 1px solid lightgray;
  background-color: #fff;
  margin-top: 20px;
`;

const UserInfo = styled.div`
  height: 60px;
  padding: 5px 10px;
  display: flex;
  align-items: center;

  border-bottom: 1px solid lightgray;

  img {
    width: 38px;
    height: 38px;
    border-radius: 100%;
    margin-left: 10px;
    border: 1px solid lightgray;
  }

  p {
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
    margin-left: 10px;
  }
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid lightgrey;

  img {
    width: 100%;
  }
`;

const PostCTA = styled.div`
  width: 90%;
  margin: auto;
`;

const CTAButtons = styled.div`
  height: 54px;
  display: flex;
  align-items: center;

  img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

const LikeCount = styled.div`
  p {
    font-size: 15px;

    font-weight: 600;
    margin-bottom: 10px;
  }
`;

const PostDescription = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  h5 {
    font-size: 14px;
    line-height: 20px;
    border: none;
    width: 100%;
    height: ${(props) => (props.moreButton ? "fit-content" : "40px")};
    overflow-y: hidden;
    word-break: break-all;
    min-height: 40px;
    font-weight: 500;
  }

  .description-buttons {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    color: gray;
    p {
      cursor: pointer;
    }
  }

  .recent-comment {
    font-size: 12px;
    display: flex;
    align-items: center;
    strong {
      margin-right: 10px;
    }
  }
`;

const CommentInput = styled.div`
  padding: 10px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid lightgray;

  input {
    flex: 0.9;
    height: 30px;
    border: none;
    margin-right: 10px;
    outline: none;
  }

  button {
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 15px;
    color: #18a4f8;
  }
`;

const AllCommentContainer = styled.div`
  padding: 15px;

  .post-comment {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .user-image {
      margin-right: 20px;
      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
    }

    .user-comment {
      display: flex;

      font-size: 13px;

      strong {
        margin-right: 10px;
      }
    }
  }
`;
export default Post;
