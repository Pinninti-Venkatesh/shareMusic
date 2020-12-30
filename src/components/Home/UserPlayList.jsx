import React, { Component } from "react";
import fire from "../../config/fire";
import storageRef from "../../config/storage";
import database from "../../config/database";
import AudioComponent from "../Home/AudioComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus,faTrashAlt,faCaretLeft,faCaretRight,faEllipsisV,} from "@fortawesome/free-solid-svg-icons";
import "./UserPlayList.scss";
export default class Userplaylist extends Component {
  state = {
    userAudioComponentsList: [],
    PlayListName: "",
    isPublic: false,
    parentCalled:-1
  };
  componentWillMount(){
    this.renderMusicFiles(this.props.playListName);
  }
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  toggleAccess = () => {
    var accessStatus = document.getElementById(
      this.state.PlayListName + "accessToggler"
    ).checked;
    let PlayListName = this.state.PlayListName;
    var userid = fire.auth().currentUser.uid;
    if (accessStatus) {
      database.ref("PublicPlayList/" + PlayListName).set({ownerId: userid,});
      database.ref("users/" + userid + "/PlayList/" + PlayListName).set({isPublic: true,});
    } else {
      database.ref("PublicPlayList/" + PlayListName).remove();
      database.ref("users/" + userid + "/PlayList/" + PlayListName).set({isPublic: false,});
    }
  };
  shouldComponentUpdate(nextProps,nextState){
    //console.log('Inside shouldComponentUpdate userplaylist',nextProps.parentCalled+ '  '+this.props.playListId)
    if(this.props.playListId==nextProps.parentCalled[1]&&this.state==nextState){
      this.setState({parentCalled:nextProps.parentCalled[0]});
      //console.log('setting state');
      return false;
    }
    else{
      //console.log('component updating');
      return true;
    }
  }
  // invokeChild=(songKey,playListKey)=>{
  //   console.log('invokeChild userPlayList',songKey+' '+playListKey);
  //   console.log('currentPlayListKey',this.props.playListId);
  //   if(playListKey==this.props.playListId){
  //     this.setState({parentCalled:songKey});
  //   }
  // };
  renderMusicFiles = (PlayListPath) => {
    let userComponentsList = [];
    var userid = fire.auth().currentUser.uid;
    let playListName = PlayListPath.substring(
      PlayListPath.lastIndexOf("/") + 1
    );
    storageRef.child(PlayListPath + "/").listAll().then((res) => {
        res.items.forEach(function (itemRef) {
          userComponentsList.push(itemRef);
        });
        this.setState({
          userAudioComponentsList: userComponentsList,
          PlayListName: playListName,
        });
      })
      .catch(function (error) {
        console.log("Unable to fetch songs in usersongs", error);
      });
    database.ref("/users/" + userid + "/PlayList/" + playListName).once("value").then((snapshot) => {
        console.log("snapshot", snapshot.val());
        //console.log('isPublic',snapshot.val());
        var isPublic = snapshot.val() ? snapshot.val().isPublic : "noRight";
        if (isPublic == true) {
          setTimeout(() => {
            document.getElementById(playListName + "accessToggler").checked = true;
          }, 3000);
        } else if (isPublic == "noRight") {
          setTimeout(() => {
            document.getElementById(playListName + "accessToggler").style.display = "none";
          }, 3000);
        }
        this.setState({ isPublic: isPublic });
      });
  };
  forceUpdateHandler = () => {
    this.renderMusicFiles(this.props.playListName);
  };
  uploadSongTrigger = (e) => {
    if(e.target.nextSibling!=null){
        e.target.nextSibling.click();
    }
    
  };
  uploadSong = () => {
    console.log("upload song initiated");
    //let songUploadFLag=false;
    var songs = document.getElementById("uploadSongs").files;
    //console.log(typeof songs);
    songs = Array.from(songs);
    //console.log(typeof songs);
    songs.map((song) => {
      var jsmediatags = require("jsmediatags");
      jsmediatags.read(song, {
        onSuccess: (tag) => {
          var songPicture = tag.tags.picture.description? tag.tags.picture.description: "https://firebasestorage.googleapis.com/v0/b/sharemusic-7f76e.appspot.com/o/default%2FdefaultImage.png?alt=media&token=0e799032-60f7-4c31-8766-258ecdd6b880";
          var songTitle = tag.tags.title;
          var songmetadata = {
            customMetadata: {
              songPicture: songPicture,
              songTitle: songTitle,
            },
          };
          var userid = fire.auth().currentUser.uid;
          storageRef.child("users/" +userid +"/PlayLists/" +this.state.PlayListName +"/" +song.name)
          .put(song, songmetadata).then((snapshot) => {
              console.log("Uploaded a blob or file!", snapshot);
              this.forceUpdateHandler();
            })
            .catch(function (error) {
              console.log("error in file upload", error);
            });
        },
        onError: function (error) {
          console.log(":(", error.type, error.info);
        },
      });
    });
  };
  playSong = (src, statesobj) => {
    statesobj.playListName=this.state.PlayListName;
    statesobj.playListKey=this.props.playListId
    this.props.playSong(src, statesobj);
  };
  deletePlayList =()=> {
    var userId = fire.auth().currentUser.uid;
    storageRef.child("users/" + userId + "/PlayLists/" + this.state.PlayListName).listAll().then((res) => {
        res.items.forEach((itemRef) => {
          itemRef.delete().then(() => {
              console.log("file deleted");
              this.props.deletePlayListHandler(this.props.playListName);
            })
            .catch((error) => {
              console.log("error in deleting the file");
            });
            
        });
        
      });
  }
  render() {
    let i = 1;
    let noOfComps=this.state.userAudioComponentsList.length;
    return (
      <>
        <div className="PlayList">
          <div className="playListHead">
            <h1 id={this.state.PlayListName} style={{ margin: "0px" }}>
              {this.state.PlayListName}
            </h1>
            <div className="btnControlsGroup">
                
                  <label className="addButton">
                    <FontAwesomeIcon
                      icon={faPlus}
                    ></FontAwesomeIcon>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      id="uploadSongs"
                      accept=".mp3,"
                      onChange={this.uploadSong}
                      multiple
                    ></input>
                  </label>
                
                  <div className="switch">
                    <input
                      type="checkbox"
                      className="input"
                      id={this.state.PlayListName + "accessToggler"}
                      onClick={() => {
                        this.toggleAccess();
                      }}
                    />
                    <div className="circle"></div>
                  </div>
                  <div className="deleteIcon">
                    <span>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        onClick={this.deletePlayList}
                      >
                        Delete
                      </FontAwesomeIcon>
                    </span>
                  </div>
            </div>
          </div>
          <div className="audioList">
          {noOfComps>4 &&
            <button
              className="scrollLeft"
            >
              <FontAwesomeIcon icon={faCaretLeft} onClick={(e) => {
                e.target.parentElement.parentElement.parentElement.scrollBy({top: 0,left: -300,behavior : "smooth"});
              }} ></FontAwesomeIcon>
            </button>
  }
            {!this.state.userAudioComponentsList.length == 0 && (
              <div className="AudioComponents">
                {this.state.userAudioComponentsList.map((AudioObject) => (
                  <AudioComponent
                  ref={this.child}
                    audioID={i}
                    key={i++}
                    playListId={this.props.playListId}
                    playSong={this.playSong}
                    FileInfo={AudioObject}
                    parentCalled={this.state.parentCalled}
                  />
                ))}
              </div>
            )}
            {this.state.userAudioComponentsList.length == 0 && (
              <div className="AudioComponents">
                <div>No songs in the list</div>
              </div>
            )}
            {noOfComps>4 &&
            <button
              className="scrollRight"
            >
              <FontAwesomeIcon icon={faCaretRight} 
              onClick={(e) => {
                e.target.parentElement.parentElement.parentElement.scrollBy({top: 0,left: 300,behavior : "smooth"});
              }}
              ></FontAwesomeIcon>
            </button>
  }
          </div>
        </div>
      </>
    );
  }
}
