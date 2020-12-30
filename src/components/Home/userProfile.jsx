import React from "react";
import "./userProfile.scss";
import fire from "../../config/fire";
import database from "../../config/database";
import storageRef from "../../config/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPen,faMars,faVenus,faTransgender} from "@fortawesome/free-solid-svg-icons";
class UserProfile extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username:"",
      genderTag:"",
      age:""
    }
  }
  componentDidMount(){
    var user = fire.auth().currentUser.uid;
    var username = "";
    let genderTag = "";
    database.ref("/users/" + user).once("value").then( (snapshot)=> {
        username = snapshot.val().username;
        genderTag = snapshot.val().gender;
        if (genderTag == "Male") {
          genderTag = <FontAwesomeIcon icon={faMars} color="#00ACFA"/>;
        } else if (genderTag == "Female") {
          genderTag = <FontAwesomeIcon icon={faVenus} color="#FF8AB7"/>;
        } else {
          genderTag = <FontAwesomeIcon icon={faTransgender} color="orange"/>;
        }
        var age = snapshot.val().age;
        this.setState({ username, genderTag,age});
      });
    storageRef.child("users/" + user + "/" + user + ".jpg").getDownloadURL().then(function (url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
        var img = document.getElementById("userImage");
        img.src = url;
      })
      .catch(function (error) {
        storageRef.child("/default/gmaildp.jpeg").getDownloadURL().then(function (url) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = function (event) {
              var blob = xhr.response;
            };
            xhr.open("GET", url);
            xhr.send();
            var img = document.getElementById("userImage");
            img.src = url;
          })
          .catch(function (error) {
            console.log("imageDownload URL " + error);
          });
      });
  }
  changePP = () => {
    var profilePic = document.getElementById("profilePicUpload").files[0];
    var user = fire.auth().currentUser;
    if (user != null) {
      var uid = user.uid;
      storageRef.child("users/" + uid + "/" + uid + ".jpg").put(profilePic).then((snapshot) => {
          storageRef.child("users/" + uid + "/" + uid + ".jpg").getDownloadURL().then(function (url) {
              var xhr = new XMLHttpRequest();
              xhr.responseType = "blob";
              xhr.onload = function (event) {
                var blob = xhr.response;
              };
              xhr.open("GET", url);
              xhr.send();
              var img = document.getElementById("userImage");
              img.src = url;
            })
            .catch(function (error) {
              console.log("unable to fetch download url " + error);
              console.log(error);
            });
        });
    }
  };
  UploadPic = () => {
    document.getElementById("profilePicUpload").click();
  };
  render() {
    

    return (
      <div className="userCard">
        <div className="picture">
          <img id="userImage" className="img-fluid" alt="User Image" />
          <input
            type="file"
            style={{ display: "none" }}
            id="profilePicUpload"
            onChange={this.changePP}
            accept=".jpg,"
          ></input>
        </div>
        <div className="team-content">
          <h1 id="username">{this.state.username}</h1>
          <span className="title" id="genderAgeTag">
            <h3>{this.state.age}</h3>
            <h3>{this.state.genderTag}</h3>
          </span>
        </div>
        <ul className="social">
          <li onClick={this.UploadPic}>
            <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserProfile;
