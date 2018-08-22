export const fetchUserSuccess = (user) => {
  return {
    type: 'FETCH_USER_SUCCESS',
    user
  };
};

export const fetchUserError = () => {
  return {
    type: 'FETCH_USER_ERROR'
  };
};

export const fetchUser = (accessToken) => {

  return dispatch => {
    const request = new Request('https://api.spotify.com/v1/me', {
      headers: new Headers({
        'Authorization': 'Bearer ' + accessToken
      })
    });

    fetch(request).then(res => {
      // send user back to homepage if no token
      if(res.statusText === "Unauthorized") {
        window.location.href = './';
      }
      return res.json();
    }).then(res => {
      dispatch(fetchUserSuccess(res));
    }).catch(err => {
      dispatch(fetchUserError(err));
    });
  };
};

export const getGenomelinkUrlSuccess = (url) => {
  return {
    type: 'GET_URL_SUCCESS',
    url
  };
};

export const getGenomelinkUrlError = () => {
  return {
    type: 'GET_URL_ERROR'
  };
};


export const getGenomelinkUrl = () => {

  return dispatch => {
    const request = new Request('http://localhost:5000/get_url', {
      // headers: new Headers({
      //   'Authorization': 'Bearer ' + accessToken
      // })
    });

    fetch(request).then(res => {
      // send user back to homepage if no token

      return res.json();
    }).then(res => {
      console.log('RESPONSE URLLL', res.url)
      dispatch(getGenomelinkUrlSuccess(res.url));
    }).catch(err => {
      dispatch(fetchUserError(err));
    });
  };
};

export const addSongToLibrarySuccess = (songId) => {
  return {
    type: 'ADD_SONG_TO_LIBRARY_SUCCESS',
    songId
  };
};

export const addSongToLibraryError = () => {
  return {
    type: 'ADD_SONG_TO_LIBRARY_ERROR'
  };
};

export const addSongToLibrary = (accessToken, id) => {

  return dispatch => {

    const request = new Request(`https://api.spotify.com/v1/me/tracks?ids=${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Authorization': 'Bearer ' + accessToken
      })
    });

    fetch(request).then(res => {
      if(res.ok) {
        dispatch(addSongToLibrarySuccess(id));
      }
    }).catch(err => {
      dispatch(addSongToLibraryError(err));
    });
  };
};
