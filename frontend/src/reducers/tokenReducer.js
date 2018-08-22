export const tokenReducer = (state = {}, action) => {
  switch (action.type) {

  case "SET_TOKEN":
    return {
      ...state,
      token: action.token
    };

    case "SET_GENE_TOKEN":
      return {
        ...state,
        genomelinkToken: action.token
      };

  default:
    return state;
  }

};

export default tokenReducer;
