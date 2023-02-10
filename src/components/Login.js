import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import { useStateValue } from "../StateProvider";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [{}, dispatch] = useStateValue();
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const newUser = {
          userName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        };

        dispatch({
          type: "SET_USER",
          user: newUser,
        });

        localStorage.setItem("user", JSON.stringify(newUser));
        navigate("/");
      })
      .catch((err) => alert(err));
  };
  return (
    <Container>
      <Main>
        <Form onSubmit={login}>
          <Logo>
            <img src="./instagram-text-logo.png" alt="" />
          </Logo>

          <InputContainer>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </InputContainer>
          <InputContainer>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </InputContainer>

          <button onClick={login}>Log In</button>
        </Form>

        <SignUpContainer>
          <p>
            Don't Have an account ?
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </SignUpContainer>
      </Main>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Main = styled.main``;

const Form = styled.form`
  background: #fff;
  border: 1px solid lightgray;
  padding: 20px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;

  button {
    height: 33px;
    width: 230px;
    background-color: #0095f6;
    border: none;
    outline: none;
    border-radius: 5px;
    margin-top: 30px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
  }
`;

const Logo = styled.div`
  width: 250px;
  img {
    width: 100%;
  }
`;

const InputContainer = styled.div`
  height: 25px;
  width: 250px;
  margin-top: 20px;
  input {
    height: 100%;
    width: 100%;
    background-color: #fafafa;
    border: 1px solid gray;
    padding: 5px;
  }
`;

const SignUpContainer = styled.div`
  border: 1px solid lightgray;
  padding: 20px;
  background-color: #fff;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    font-size: 14px;

    span {
      color: #18a4f8;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;
export default Login;
