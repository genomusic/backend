import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {fetchUser, getGenomelinkUrl} from '../../actions/userActions';
import {setToken} from '../../actions/tokenActions';
import {pauseSong, playSong, resumeSong, stopSong} from '../../actions/songActions';
import {bindActionCreators} from 'redux';
import './LoginPage.css'

class LoginPage extends Component {

    constructor(props) {
        super(props);


        this.props.getGenomelinkUrl();
        this.state = {}
    }

    onSpotifyLoginClick() {
        window.location.href = 'https://accounts.spotify.com/en/authorize?client_id=3e6578eeacef43b9af9b803880e0c51e&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state&response_type=token&redirect_uri=https:%2F%2Fgenomusic.herokuapp.com%2Fcallback';
    }

    onGenomelinkLoginClick() {
        window.location.href = this.props.genomelinkUrl
    }

    render() {
        return (
            <div className={'login-wrapper'}>
                <h1 className={'title'}> Genomusic </h1>
                {this.props.spotifyToken ?
                    <div>
                        <h2 className={'step'}> Second Step: </h2>
                        <button
                            onClick={this.onGenomelinkLoginClick.bind(this)}
                            className='main-pause-play-btn login'>
                            Login With Genomelink
                        </button>
                    </div> :
                    <div>
                        <h2 className={'step'}> First Step: </h2>
                        <button
                            onClick={this.onSpotifyLoginClick}
                            className='main-pause-play-btn login'>
                            Login With Spotify
                        </button>
                    </div>}


            </div>
        );
    }


};

LoginPage.propTypes = {
    headerTitle: PropTypes.string,
    audioControl: PropTypes.func,
    resumeSong: PropTypes.func,
    pauseSong: PropTypes.func
};

const mapDispatchToProps = dispatch => {

    return bindActionCreators({
        fetchUser,
        setToken,
        playSong,
        stopSong,
        pauseSong,
        resumeSong,
        getGenomelinkUrl
    }, dispatch);

};

const mapStateToProps = (state) => {

    return {
        headerTitle: state.uiReducer.title,
        genomelinkUrl: state.userReducer.url,
        spotifyToken: state.tokenReducer.token
    };

};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
