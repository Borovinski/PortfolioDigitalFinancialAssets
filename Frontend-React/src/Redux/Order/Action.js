import api from '@/Api/api';
import * as types from './ActionTypes';
import { toast } from "@/components/ui/use-toast";

// Оплата ордера с проверкой на баланс и отображением ошибок
export const payOrder = ({ jwt, coinId, quantity, orderType, amount, balance }) => async (dispatch) => {
  if (balance < amount) {
    toast({
      title: "Недостаточно средств",
      description: "У вас недостаточно средств для совершения покупки.",
      variant: "destructive",
    });
    return;
  }

  dispatch({ type: types.PAY_ORDER_REQUEST });

  try {
    const response = await api.post('/api/orders/pay',
      {
        coinId,
        quantity,
        orderType,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch({
      type: types.PAY_ORDER_SUCCESS,
      payload: response.data,
      amount
    });
  } catch (error) {
    const errorMsg = error?.response?.data?.message || "Что-то пошло не так";

    dispatch({
      type: types.PAY_ORDER_FAILURE,
      error: errorMsg,
    });

    toast({
      title: "Ошибка при покупке",
      description: errorMsg === "Insufficient funds for this transaction."
        ? "У вас недостаточно средств для совершения покупки."
        : errorMsg,
      variant: "destructive",
    });
  }
};



// Получить ордер по ID
export const getOrderById = (jwt, orderId) => async (dispatch) => {
  dispatch({ type: types.GET_ORDER_REQUEST });

  try {
    const response = await api.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
    });

    dispatch({
      type: types.GET_ORDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ORDER_FAILURE,
      error: error.message,
    });
  }
};

// Получить все ордера пользователя (фильтрация по типу и символу актива)
export const getAllOrdersForUser = ({ jwt, orderType, assetSymbol }) => async (dispatch) => {
  dispatch({ type: types.GET_ALL_ORDERS_REQUEST });

  try {
    const response = await api.get('/api/orders', {
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      params: {
        order_type: orderType,
        asset_symbol: assetSymbol,
      },
    });

    dispatch({
      type: types.GET_ALL_ORDERS_SUCCESS,
      payload: response.data,
    });

    console.log("Успешно загружены ордера", response.data);
  } catch (error) {
    console.log("Ошибка при загрузке ордеров:", error);

    dispatch({
      type: types.GET_ALL_ORDERS_FAILURE,
      error: error.message,
    });
  }
};
