import React, { Fragment, useEffect, useState } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
let user;
const GET_USERS = gql`
  query getUsers {
    getUsers {
      userName
      latestMessage {
        content
        to
        from
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query ($from: String!) {
    getMessages(from: $from) {
      content
      from
      to
    }
  }
`;
export default function Home(props) {
  const token = localStorage.getItem("token");
  const [selectedUser, setSelectedUser] = useState(null);
  let userDetails;
  if (token) {
    const decodedToken = jwtDecode(token);
    const expiresAt = new Date(decodedToken.exp * 1000);
    if (new Date() > expiresAt) {
      localStorage.removeItem("token");
    } else {
      user = decodedToken;
    }
  } else {
    console.log("no token");
  }
  const { loading, data } = useQuery(GET_USERS);

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  useEffect(() => {
    if (selectedUser) {
      getMessages({ variables: { from: selectedUser } });
    }
  }, [selectedUser]);

  if (messagesData) console.log(messagesData.getMessages);

  const logout = () => {
    localStorage.removeItem("token");
    userDetails = null;
    props.history.push("/login");
  };

  if (!data || loading) {
    userDetails = <p>Loading..</p>;
  } else if (data.getUsers.length === 0) {
    userDetails = <p>No Users...</p>;
  } else if (data.getUsers.length > 0) {
    userDetails = data.getUsers.map((user) => (
      <div
        className="d-flex p-3"
        key={user.userName}
        onClick={() => setSelectedUser(user.userName)}
      >
        <div>
          <p className="text-success">{user.userName}</p>
          <p className="font-weight-light">You are now connected!</p>
        </div>
      </div>
    ));
  }
  return (
    <Fragment>
      <Row className="bg-white">
        <Col className="text-center">
          <Button variant="link">
            <Link to={token ? "/" : "/login"}>Login</Link>
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="link">
            <Link to={token ? "/" : "/register"}>Register</Link>
          </Button>
        </Col>
        <Col className="text-center">
          <Button variant="link" onClick={logout}>
            Logout
          </Button>
        </Col>
      </Row>
      <Row className="mt-3 bg-white ">
        <Col xs={4} className="p-0 bg-secondary">
          {userDetails}
        </Col>
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((message) => (
              <p key={message.content}>{message.content}</p>
            ))
          ) : (
            <p>Messages</p>
          )}
        </Col>
      </Row>
    </Fragment>
  );
}
