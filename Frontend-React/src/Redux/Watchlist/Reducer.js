import { existInWatchlist } from "@/Util/existInWatchlist";
import * as types from "./ActionTypes";

const initialState = {
  watchlist: null,
  loading: false,
  error: null,
  items: [],
};

const watchlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_USER_WATCHLIST_REQUEST:
    case types.ADD_COIN_TO_WATCHLIST_REQUEST:
    case types.REMOVE_COIN_FROM_WATCHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.GET_USER_WATCHLIST_SUCCESS:
      return {
        ...state,
        watchlist: action.payload,
        items: action.payload.coins,
        loading: false,
        error: null,
      };

    case types.ADD_COIN_TO_WATCHLIST_SUCCESS: {
      const updatedItems = existInWatchlist(state.items, action.payload)
        ? state.items.filter((item) => item.id !== action.payload.id) // если монета есть — убираем
        : [action.payload, ...state.items]; // если нет — добавляем

      return {
        ...state,
        items: updatedItems,
        loading: false,
        error: null,
      };
    }

    case types.REMOVE_COIN_FROM_WATCHLIST_SUCCESS:
      return {
        ...state,
        items: state.items.filter((coin) => coin.id !== action.payload),
        loading: false,
        error: null,
      };

    case types.GET_USER_WATCHLIST_FAILURE:
    case types.ADD_COIN_TO_WATCHLIST_FAILURE:
    case types.REMOVE_COIN_FROM_WATCHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default watchlistReducer;
