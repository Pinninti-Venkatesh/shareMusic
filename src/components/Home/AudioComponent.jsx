import React, { Component } from "react";
import "./AudioComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import storageRef from "../../config/storage";
class AudioComponent extends Component {
  componentWillMount(){
    let pathRef = this.props.FileInfo;
    pathRef.getMetadata().then((metadata)=>{
      //console.log('file metadata',metadata);
      let songName=metadata.name;
      let songImage='https://firebasestorage.googleapis.com/v0/b/sharemusic-7f76e.appspot.com/o/default%2FdefaultImage.png?alt=media&token=0e799032-60f7-4c31-8766-258ecdd6b880';
      if(metadata.customMetadata!=undefined){
        songName=metadata.customMetadata.songTitle;
        songImage=metadata.customMetadata.songPicture;
      }
      this.setState({songName:songName,songImage:songImage});
    }).catch(function(error) {
      console.log('metadata error',error);
    });
  }
  constructor(props) {
    super(props);
    this.state={
      songName:'',
      songImage:''
    }
  }
  shouldComponentUpdate(nextProps){
    //console.log('Inside shouldComponentUpdate audiocomp',nextProps.parentCalled+ '  '+this.props.audioID)
    if(this.props.audioID==nextProps.parentCalled){
      this.playMusic();
    }
    return true;
  }
  // invokeChild=(songKey)=>{
  //   console.log('child invoked in audiocomp '+songKey+' '+this.props.audioID);
  //   if(songKey==this.props.audioID){
  //     this.playMusic();
  //   }
  // };
  playMusic=()=>{
    var pathRef = this.props.FileInfo.location.path_;
    storageRef.child(pathRef).getDownloadURL().then((url)=> {
      let currentCompState=this.state
      currentCompState.key=this.props.audioID;
      console.log('currentCompState',currentCompState);
        this.props.playSong(url,currentCompState);
        console.log('song url',url);
        url=url.substring(0,url.indexOf('.mp3')+4);
        var jsmediatags = require("jsmediatags");
        jsmediatags.read(url, {
  onSuccess: function(tag) {
    //console.log('jsmediatags',tag);
  },
  onError: function(error) {
    console.log('jsmediatagserror',error);
  }
});
    }).catch(function(error) {
      console.log("unable to fetch download url "+error);
      console.log(error);
    });
  }
  render() {
    return (
      <div className="musicFileCard">
        <div className="picture">
          <img className="albumArt" src={this.state.songImage} alt="Card image cap"/>
        </div>
        <div className="musicDesc">
            <button className="playBtn animate__pulse" onClick={this.playMusic}>
              <FontAwesomeIcon icon={faPlayCircle} size='2x'/>
            </button>
            <div className="songTitleAC" title={this.state.songName}>{this.state.songName}</div>
        </div>
      </div>
    );
  }
}

export default AudioComponent;
