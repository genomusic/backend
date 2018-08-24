import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './UserPlaylists.css';

class UserPlaylists extends Component {

  componentWillReceiveProps (nextProps) {
    if(nextProps.userId !== '' && nextProps.token !== '') {
      this.props.fetchPlaylistsMenu(nextProps.userId, nextProps.token);
    }
  }

  renderPlaylists() {
    return this.props.playlistMenu.map(playlist => {
      const getPlaylistSongs = () => {
        this.props.fetchPlaylistSongs(playlist.owner.id, playlist.id, this.props.token);
        this.props.updateHeaderTitle(playlist.name);
      };

      return (
        <li onClick={ getPlaylistSongs } className={this.props.title === playlist.name ? 'active side-menu-item' : 'side-menu-item'} key={ playlist.id }>
          { playlist.name }
        </li>
      );
    });
  }

  renderGenePlaylist() {

    const getPlaylistSongs = () => {
      console.log('PLAYLIST SONGS??', this.props)
      this.props.fetchGenomelinkSongsSuccess(this.props.genomelinkPlaylist);
      this.props.updateHeaderTitle('Your Awesome Genetic Playlist');
    };

    return (
      <li onClick={ getPlaylistSongs } className={this.props.title === 'Your Awesome Genetic Playlist' ? 'active side-menu-item gene-list' : 'side-menu-item gene-list'} key={ 9999999 }>
        Your Genetic Playlist
      </li>
    );
  }

  render() {

    return (
      <div className='user-playlist-container'>
        <h3 className='user-playlist-header'>Playlists</h3>
        {this.renderGenePlaylist()}
        {
          this.props.playlistMenu && this.renderPlaylists()
        }
      </div>
    );
  }
}

UserPlaylists.propTypes = {
  userId: PropTypes.string,
  token: PropTypes.string,
  title: PropTypes.string,
  playlistMenu:  PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  fetchPlaylistsMenu: PropTypes.func,
  fetchPlaylistSongs: PropTypes.func,
  fetchGenomelinkSongsSuccess: PropTypes.func,
  updateHeaderTitle: PropTypes.func
};

export default UserPlaylists;
