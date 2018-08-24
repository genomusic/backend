import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser } from './actions/userActions';
import { setToken, setGenomelinkToken } from './actions/tokenActions';
import { playSong, stopSong, pauseSong, resumeSong } from './actions/songActions';
import { fetchGenomePlaylist } from "./actions/songActions";
import './App.css';
import Particles from 'react-particles-js';


import LoginPage from './components/LoginPage'
import Header from './components/Header';
import Footer from './components/Footer';
import UserPlaylists from './components/UserPlaylists';
import MainView from './components/MainView';
import ArtWork from './components/ArtWork';
import MainHeader from './components/MainHeader';
import SideMenu from './components/SideMenu';

class App extends Component {

	static audio;

	componentDidMount() {

	  let hashParams = {};
	  let e, r = /([^&;=]+)=?([^&;]*)/g,
	    q = window.location.hash.substring(1);
	  while ( e = r.exec(q)) {
	    hashParams[e[1]] = decodeURIComponent(e[2]);
	  }
    var url = new URL(window.location);
    console.log('PARAMSS', hashParams.access_token)
	  if(hashParams.access_token || localStorage.getItem('spotifyToken')) {

      if(hashParams.access_token) localStorage.setItem('spotifyToken', hashParams.access_token)
	    this.props.setToken(hashParams.access_token || localStorage.getItem('spotifyToken'));
	  }

	  const hasGeneToken = url.searchParams.get("genomelink_token")

    if(hasGeneToken || localStorage.getItem('genomelinkToken')) {
      if (hasGeneToken) localStorage.setItem('genomelinkToken', hasGeneToken)
      this.props.setGenomelinkToken(hasGeneToken || localStorage.getItem('genomelinkToken'));
    }

	}

	componentWillReceiveProps(nextProps) {
	  if(nextProps.token) {
	    this.props.fetchUser(nextProps.token);
	  };

    if(nextProps.canLogin) {
      console.log('GOT TOKEN!!!', localStorage.getItem('genomelinkToken'))
      this.props.fetchGenomePlaylist(localStorage.getItem('genomelinkToken'))
    }


	  if(this.audio !== undefined) {
	    this.audio.volume = nextProps.volume / 100;
	  }

	}

	stopSong = () => {
	  if(this.audio) {
	    this.props.stopSong();
	    this.audio.pause();
	  }
	}

	pauseSong = () => {
	  if(this.audio) {
	    this.props.pauseSong();
	    this.audio.pause();
	  }
	}

	resumeSong = () => {
	  if(this.audio) {
	    this.props.resumeSong();
	    this.audio.play();
	  }
	}

	audioControl = (song) => {

	  const { playSong, stopSong } = this.props;

	  if(this.audio === undefined){
	    playSong(song.track);
	    this.audio = new Audio(song.track.preview_url);
	    this.audio.play();
	  } else {
	    stopSong();
	    this.audio.pause();
	    playSong(song.track);
	    this.audio = new Audio(song.track.preview_url);
	    this.audio.play();
	  }
	}

	render() {
		if(this.props.canLogin){
            return (

				<div className='App'>
                    {CustomParticles}

					<div className='app-container'>

						<div className='left-side-section'>
							<SideMenu />
							<UserPlaylists />
							<ArtWork />
						</div>

						<div className='main-section'>
							<Header />
							<div className='main-section-container'>
								<MainHeader
									pauseSong={ this.pauseSong }
									resumeSong={ this.resumeSong }
								/>
								<MainView
									pauseSong={this.pauseSong}
									resumeSong={ this.resumeSong }
									audioControl={ this.audioControl }
								/>
							</div>
						</div>

						<Footer
							stopSong={ this.stopSong }
							pauseSong={ this.pauseSong }
							resumeSong={ this.resumeSong }
							audioControl={ this.audioControl }
						/>
					</div>
				</div>
            );

        }else {

            return (
				<div>
					<LoginPage/>
                    {CustomParticles}

				</div>
            )
        }


	}
}

const CustomParticles = (<Particles  className={'part'} params={{
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 2000
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: 'img/github.svg',
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    retina_detect: true
}}/>)

App.propTypes = {
  token: PropTypes.string,
  fetchUser: PropTypes.func,
  setToken: PropTypes.func,
  pauseSong: PropTypes.func,
  playSong: PropTypes.func,
  stopSong: PropTypes.func,
  resumeSong: PropTypes.func,
  volume: PropTypes.number
};

const mapStateToProps = (state) => {

  return {
    canLogin: state.tokenReducer.token && state.tokenReducer.genomelinkToken,
    token: state.tokenReducer.token,
    genomelinkToken: state.genomelinkToken,
    volume: state.soundReducer.volume
  };

};

const mapDispatchToProps = dispatch => {

  return bindActionCreators({
    fetchUser,
    setToken,
    setGenomelinkToken,
    fetchGenomePlaylist,
    playSong,
    stopSong,
    pauseSong,
    resumeSong
  },dispatch);

};

export default connect(mapStateToProps, mapDispatchToProps)(App);
