import * as types from './ActionTypes';

const initialState = {
  asset: null,
  userAssets: [],
  loading: false,
  error: null,
  assetDetails: null,
  profitability: [],
};

const assetReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_ASSET_REQUEST:
    case types.GET_USER_ASSETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case types.GET_ASSET_SUCCESS:
      return {
        ...state,
        asset: action.payload,
        loading: false,
        error: null,
      };
    case types.GET_ASSET_DETAILS_SUCCESS:
      return {
        ...state,
        assetDetails: action.payload,
        loading: false,
        error: null,
      };
    case types.GET_USER_ASSETS_SUCCESS:
      return {
        ...state,
        userAssets: action.payload,
        loading: false,
        error: null,
      };
    case types.GET_ASSET_FAILURE:
    case types.GET_USER_ASSETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "GET_PROFITABILITY_SUCCESS":
      return {
        ...state,
        profitability: action.payload,
      };
    default:
      return state;
  }
};

export default assetReducer;
