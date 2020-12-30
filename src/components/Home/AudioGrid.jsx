import React, { Component } from "react";
import storageRef from "../../config/storage";
import fire from "../../config/fire";
import AudioComponent from "../Home/AudioComponent";
import UserPlayList from "../Home/UserPlayList";
import "./AudioGrid.scss";
class AudioGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userPlayLists: [],
      parentCalled: [],
    };
    this.child = React.createRef();
  }
  componentDidMount() {
    this.renderPage();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    } else {
      return false;
    }
  }
  invokeChild = (songKey, playListKey) => {
    //this.child.current.invokeChild(songKey,playListKey);
    this.setState({ parentCalled: [songKey, playListKey] });
    console.log("in Audiogrid", songKey + " " + playListKey);
  };
  renderPage = () => {
    let userPlayLists = [];
    var userid = fire.auth().currentUser.uid;
    storageRef
      .child("users/" + userid + "/PlayLists/")
      .listAll()
      .then((res) => {
        res.prefixes.forEach(function (itemRef) {
          userPlayLists.push(itemRef.location.path_);
        });
        this.setState({ userPlayLists: userPlayLists });
        console.log("AudioGrid state Updated");
      })
      .catch(function (error) {
        console.log("Unable to fetch songs", error);
      });
  };
  forceUpdateHandler = () => {
    this.renderPage();
  };
  playSong = (src, statesobj) => {
    this.props.playSong(src, statesobj);
  };
  deletePlayListHandler = (playListPath) => {
    let userPlayLists = this.state.userPlayLists.filter(
      (path) => path != playListPath
    );
    this.setState({ userPlayLists });
  };
  render() {
    //let AudioObjects = this.state.Top10AudioComponentsList;
    console.log("rendering data");
    let i = 1;
    return (
      <React.Fragment>
        {/* <div className="Top10List">
          <h1>Top 10</h1>
          <div className="AudioComponents">
            {this.state.Top10AudioComponentsList.map((AudioObject) => (
              <AudioComponent
                key={i++}
                playSong={this.playSong}
                FileInfo={AudioObject}
              />
            ))}
          </div>
        </div> */}
        {/*My playList*/}
        {/*<UserPlayList playSong={this.playSong} />*/}
        <div>
          <input
            type="text"
            className="playListInput"
            id="newPlayListName"
            placeholder="PlayList Name"
          />
          <label>
            <button
              className="btn btn-primary"
              onClick={() => {
                this.addPlayList();
              }}
            >
              Upload PlayList
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              id="uploadPlayList"
              onChange={() => {
                this.uploadPlayList();
              }}
              accept=".mp3,"
              multiple
            ></input>
          </label>
        </div>
        {this.state.userPlayLists.map((playListObj) => (
          <UserPlayList
            ref={this.child}
            playSong={this.playSong}
            playListName={playListObj}
            playListId={i}
            key={i++}
            parentCalled={this.state.parentCalled}
            deletePlayListHandler={this.deletePlayListHandler}
          />
        ))}
      </React.Fragment>
    );
  }
  addPlayList = () => {
    const playListName = document.getElementById("newPlayListName");
    if (playListName != undefined) {
      //var userid = fire.auth().currentUser.uid;
      //storageRef.child("users/" + userid + "/PlayLists/" + playListName.value);
      document.getElementById("uploadPlayList").click();
      //let songUploadFLag = false;
    }
  };
  uploadPlayList = () => {
    const playListName = document.getElementById("newPlayListName");
    var songs = document.getElementById("uploadPlayList").files;
    //console.log(typeof songs);
    songs = Array.from(songs);
    songs.push("Dummy");
    //console.log(typeof songs);
    var userid = fire.auth().currentUser.uid;
    fire
      .database()
      .ref("users/" + userid + "/PlayList/" + playListName.value)
      .set({
        isPublic: false,
      });
    songs.map((song) => {
      var jsmediatags = require("jsmediatags");
      if (song == "Dummy") {
        this.forceUpdateHandler();
      } else {
        jsmediatags.read(song, {
          onSuccess: (tag) => {
            //console.log(tag);
            console.log(tag);
            var songPicture = tag.tags.picture
              ? tag.tags.picture.description
              : "https://firebasestorage.googleapis.com/v0/b/sharemusic-7f76e.appspot.com/o/default%2FdefaultImage.png?alt=media&token=0e799032-60f7-4c31-8766-258ecdd6b880";
            var songTitle = tag.tags.title ? tag.tags.title : "Unknown";
            var songmetadata = {
              customMetadata: {
                songPicture: songPicture,
                songTitle: songTitle,
              },
            };
            var userid = fire.auth().currentUser.uid;
            storageRef
              .child(
                "users/" +
                  userid +
                  "/PlayLists/" +
                  playListName.value +
                  "/" +
                  song.name
              )
              .put(song, songmetadata)
              .then((snapshot) => {
                console.log("Uploaded a blob or file!", snapshot);
              })
              .catch(function (error) {
                console.log("error in file upload", error);
              });
          },
          onError: function (error) {
            console.log(":(", error.type, error.info);
          },
        });
      }
    });
  };
}

export default AudioGrid;
