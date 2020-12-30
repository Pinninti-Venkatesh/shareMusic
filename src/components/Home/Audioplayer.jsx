import React, { Component } from "react";
import "./Audioplayer.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay,faStepForward,faStepBackward,faPause} from "@fortawesome/free-solid-svg-icons";
export default class Audioplayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSongPlaying:true

    };
  }
  setSeekBar=()=>{
    let audioControl=document.getElementsByTagName('audio')[0];
    let audioSeekBar=document.getElementById("seekBar");
    audioSeekBar.max=audioControl.duration;
    audioControl.ontimeupdate=()=>{
      audioSeekBar.value=audioControl.currentTime;
    }
  }
  changeSeekBar=()=>{
    let audioControl=document.getElementsByTagName('audio')[0];
    let audioSeekBar=document.getElementById("seekBar");
    audioControl.currentTime=audioSeekBar.value;
  }
  toggleSongState=()=>{
    let audioControl=document.getElementsByTagName('audio')[0];
    if(audioControl.paused){
      audioControl.play();
      this.setState({isSongPlaying:true});
    }
    else{
      this.setState({isSongPlaying:false});
      audioControl.pause();
    }
  }
  playPrevSong=()=>{
    let nextSongKey=this.props.propsofGD.currentSongKey-1;
    this.props.playNextorPrevSong(nextSongKey,this.props.propsofGD.currentPlayListKey);
  }
  playNextSong=()=>{
    let nextSongKey=this.props.propsofGD.currentSongKey+1;
    this.props.playNextorPrevSong(nextSongKey,this.props.propsofGD.currentPlayListKey);
  }
  render() {
    let imageurl = this.props.propsofGD.currentSongImage;
    let playPauseButton=this.state.isSongPlaying?faPause:faPlay;
    return (
      <div className="AudioPlayer">
        <div className="picture">
          <img src={imageurl} id="playerSongImageA" alt="" />
        </div>
        <div className="SongTitle" title={this.props.propsofGD.currentSongName}>
        {this.props.propsofGD.currentSongName}
        </div>
        <div className="audioControls">
            <div className="BtnControls">
                <span className="prev Btn" onClick={this.playPrevSong}><FontAwesomeIcon icon={faStepBackward}/></span>
                <span onClick={this.toggleSongState} className="play Btn"><FontAwesomeIcon icon={playPauseButton}/></span>
                <span className="next Btn" onClick={this.playNextSong}><FontAwesomeIcon icon={faStepForward}/></span>
            </div>
          <div className="seekbarControl">
            <input type="range" id="seekBar" min="0" max="100" onChange={this.changeSeekBar} className="slider" value="0"/>
          </div>
        </div>
        <audio controls style={{display:"none" }} src={this.props.propsofGD.currentSong} onPlaying={this.setSeekBar} autoPlay></audio>
      </div>
    );
  }
}
