import React, { Fragment } from "react";
import { Row, Button, Col } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
let user;
const GET_USERS = gql`
  query getUsers {
    getUsers {
      email
      userName
    }
  }
`;

export default function Home(props) {
  const token = localStorage.getItem("token");
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
  const { loading, data, error } = useQuery(GET_USERS);
  if (data) console.log(data);
  if (error) console.log(error);
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
    userDetails = data.getUsers.map((user) => {
      return (
        <div key={user.userName}>
          <p>{user.userName}</p>
        </div>
      );
    });
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
      <Row className="mt-3 bg-white p-3">
        <Col>{userDetails}</Col>
      </Row>
    </Fragment>
  );
}
