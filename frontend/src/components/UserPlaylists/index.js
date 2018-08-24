import UserPlaylists from "./component";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchPlaylistsMenu, fetchPlaylistSongs } from '../../actions/playlistActions';
import { fetchGenomelinkSongsSuccess } from "../../actions/songActions";
import { updateHeaderTitle } from '../../actions/uiActions';

const mapStateToProps = (state) => {
  console.log('STATE SONGS RED', state.songsReducer)
	return {
		userId: state.userReducer.user ? state.userReducer.user.id : '',
		playlistMenu: state.playlistReducer.playlistMenu ? state.playlistReducer.playlistMenu : '',
		token: state.tokenReducer.token ? state.tokenReducer.token : '',
    genomelinkPlaylist: state.songsReducer.genomelinkPlaylist ? state.songsReducer.genomelinkPlaylist : '',
		title: state.uiReducer.title
	};

};

const mapDispatchToProps = (dispatch) => {

	return bindActionCreators({
		fetchPlaylistsMenu,
		fetchPlaylistSongs,
    fetchGenomelinkSongsSuccess,
		updateHeaderTitle
	}, dispatch);

};
export default connect(mapStateToProps, mapDispatchToProps)(UserPlaylists);
