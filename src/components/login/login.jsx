import React from "react";
import fire from "../../config/fire";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
export class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  loginUser = () => {
    var email = document.getElementsByName("username")[0].value;
    var password = document.getElementsByName("password")[0].value;
    if (email && password) {
      let loggedin = 0;
      fire
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.props.loginUser();
        })
        .catch(function (error) {
          loggedin = 1;
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/user-not-found") {
            document.getElementsByClassName("loginError")[0].innerHTML =
              "User does not Exist";
          } else if (errorCode == "auth/invalid-emai") {
            document.getElementsByClassName("loginError")[0].innerHTML =
              "Invalid Email";
          } else {
            document.getElementsByClassName("loginError")[0].innerHTML =
              "Incorrect password";
          }
          console.log("errorCode" + errorCode);
          console.log("errorMessage" + errorMessage);
        });
      var user = fire.auth().currentUser;
      var name, email, photoUrl, uid, emailVerified;
      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
      }
    }
    else{
      document.getElementsByClassName("loginError")[0].innerHTML ="Please fill the required fields";
    }
  };
  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div
          style={{
            width: "90%",
            backgroundColor: "grey",
            height: "2px",
            marginTop: "20px",
          }}
        ></div>
        <div style={{ color: "red" }} className="loginError"></div>
        <div className="content">
          <div className="form">
            <div className="form-group con-input">
              <label htmlFor="username">Email</label>
              <input type="text" name="username" placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="password" />
            </div>
          </div>
        </div>
        <div className="footer">
          <button
            type="button"
            onClick={this.loginUser}
            className="button btnoutline"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}
