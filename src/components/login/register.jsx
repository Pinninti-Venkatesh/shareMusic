import React from "react";
import fire from "../../config/fire";
import storageRef from "../../config/storage";
import database from "../../config/database";
export class Register extends React.Component {
  constructor(props) {
    super(props);
  }
  registerUser = () => {
    var email = document.getElementsByName("email")[0].value;
    var password = document.getElementsByName("password")[0].value;
    var confirmPassword = document.getElementsByName("confirmPassword")[0]
      .value;
    var username = document.getElementsByName("username")[0].value;
    var age = document.getElementsByName("age")[0].value;
    var gender = document.getElementsByName("gender")[0].value;
    if (password == confirmPassword) {
      fire
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          var user = fire.auth().currentUser;
          this.props.loginUser();
          database.ref("users/" + user.uid).set({
            username: username,
            profilePicture: "",
            age: age,
            gender: gender,
          });
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          document.getElementsByClassName(
            "loginError"
          )[0].innerHTML = errorMessage;
        });
    } else {
      document.getElementsByClassName("loginError")[0].innerHTML =
        "Passwords should match blindy";
    }
  };
  render() {
    return (
      <div
        className="base-container"
        style={{ width: "500px", maxHeight: "550px" }}
      >
        <div className="header">Register</div>
        <div
          style={{
            width: "90%",
            backgroundColor: "grey",
            height: "2px",
            marginTop: "15px",
          }}
        ></div>
        <div style={{ color: "red" }} className="loginError"></div>
        <div className="content">
          <div className="form">
          <form className="form-inline">
            <div className="form-group">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                name="username"
                placeholder="What should I call you?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select className="form-control" name="gender">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            </form>
            <form className="form-inline">
            <div className="form-group">
              <label htmlFor="age"> Age</label>
              <input type="text" name="age" placeholder="what is your age?" />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="email" />
            </div>
            </form>
            <form className="form-inline">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="text" name="password" placeholder="password"/>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="text"
                name="confirmPassword"
                placeholder="confirmPassword"
              />
            </div>
            </form>
          </div>
        </div>
        <div className="footer">
          <button
            type="button"
            className="button btnoutline"
            onClick={this.registerUser}
          >
            Register
          </button>
        </div>
      </div>
    );
  }
}
