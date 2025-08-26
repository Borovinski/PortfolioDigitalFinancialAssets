import * as types from './ActionTypes';
import api from '@/Api/api';
import { toast } from "@/components/ui/use-toast";

// Получение Watchlist пользователя
export const getUserWatchlist = () => async (dispatch) => {
  dispatch({ type: types.GET_USER_WATCHLIST_REQUEST });

  const jwt = localStorage.getItem("jwt");

  try {
    const response = await api.get('/api/watchlist/user', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({
      type: types.GET_USER_WATCHLIST_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_USER_WATCHLIST_FAILURE,
      error: error.message,
    });

    toast({
      title: "Ошибка",
      description: "Не удалось загрузить список избранного.",
      variant: "destructive",
    });
  }
};

// Добавление монеты в Watchlist
export const addItemToWatchlist = (coinId) => async (dispatch) => {
  dispatch({ type: types.ADD_COIN_TO_WATCHLIST_REQUEST });

  try {
    
    const response = await api.patch(`/api/watchlist/add/coin/${coinId}`);

    dispatch({
      type: types.ADD_COIN_TO_WATCHLIST_SUCCESS,
      payload: response.data,
    });

    toast({
      title: "Добавлено",
      description: "Монета добавлена.",
      variant: "default",
    });
  } catch (error) {
    const errorMsg = error?.response?.data?.message || "Что-то пошло не так";

    dispatch({
      type: types.ADD_COIN_TO_WATCHLIST_FAILURE,
      error: errorMsg,
    });

    toast({
      title: "Ошибка",
      description: errorMsg,
      variant: "destructive",
    });
  }
};

// Удаление монеты из Watchlist
export const removeItemFromWatchlist = (coinId) => async (dispatch) => {
  dispatch({ type: types.REMOVE_COIN_FROM_WATCHLIST_REQUEST });

  try {
    await api.delete(`/api/watchlist/remove/coin/${coinId}`);

    dispatch({
      type: types.REMOVE_COIN_FROM_WATCHLIST_SUCCESS,
      payload: coinId, // передаём только id для удаления из Redux
    });

    toast({
      title: "Удалено",
      description: "Монета удалена.",
      variant: "default",
    });
  } catch (error) {
    const errorMsg = error?.response?.data?.message || "Не удалось удалить монету";

    dispatch({
      type: types.REMOVE_COIN_FROM_WATCHLIST_FAILURE,
      error: errorMsg,
    });

    toast({
      title: "Ошибка",
      description: errorMsg,
      variant: "destructive",
    });
  }
};
