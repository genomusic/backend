export const setToken = (token) => {
  return {
    type: 'SET_TOKEN',
    token
  };
};

export const setGenomelinkToken = (token) => {
  return {
    type: 'SET_GENE_TOKEN',
    token
  };
};
