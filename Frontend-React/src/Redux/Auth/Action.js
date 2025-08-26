import axios from "axios";
import * as actionTypes from "./ActionTypes";
import api, { API_BASE_URL } from "@/Api/api";

export const register = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.REGISTER_REQUEST });
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;
    if (user.jwt) localStorage.setItem("jwt", user.jwt);
    console.log("registerr :- ", user);
    userData.navigate("/");
    dispatch({ type: actionTypes.REGISTER_SUCCESS, payload: user.jwt });
  } catch (error) {
    console.log("error ", error);
    dispatch({
      type: actionTypes.REGISTER_FAILURE,
      payload: error.response?.data ? error.response.data : error,
    });
  }
};

export const login = (userData) => async (dispatch) => {
  dispatch({ type: actionTypes.LOGIN_REQUEST });

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const data = response.data;

    if (data.twoFactorAuthEnabled) {
      userData.navigate(`/two-factor-auth/${data.session}`);
      return;
    }

    if (data.jwt && data.user) {
      localStorage.setItem("jwt", data.jwt);

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          token: data.jwt,
          user: data.user, // 👈 сохраняем user с ролью
        }
      });

      // 🌟 проверка роли
      if (data.user.role === 0) {
        userData.navigate("/admin/dashboard?tab=users");
      } else {
        userData.navigate("/");
      }
    }
  } catch (error) {
    dispatch({
      type: actionTypes.LOGIN_FAILURE,
      payload: error.response?.data?.message || "Ошибка входа"
    });
  }
};


export const twoStepVerification =
  ({ otp, session, navigate }) =>
    async (dispatch) => {
      dispatch({ type: actionTypes.LOGIN_TWO_STEP_REQUEST });
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/two-factor/otp/${otp}`,
          {},
          {
            params: { id: session },
          }
        );
        const user = response.data;

        if (user.jwt) {
          localStorage.setItem("jwt", user.jwt);
          console.log("login ", user);
          navigate("/");
        }
        dispatch({ type: actionTypes.LOGIN_TWO_STEP_SUCCESS, payload: user.jwt });
      } catch (error) {
        console.log("catch error", error);
        dispatch({
          type: actionTypes.LOGIN_TWO_STEP_FAILURE,
          payload: error.response?.data ? error.response.data : error,
        });
      }
    };

//  get user from token
export const getUser = (token) => {
  return async (dispatch) => {
    if (!token) return;

    dispatch({ type: actionTypes.GET_USER_REQUEST });

    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({ type: actionTypes.GET_USER_SUCCESS, payload: res.data });
    } catch (error) {
      // Только логируем — не падаем
      console.warn("getUser: не удалось загрузить профиль", error.response?.status);
      dispatch({ type: actionTypes.GET_USER_FAILURE, payload: null });
    }
  };
};

export const sendVerificationOtp = ({ jwt, verificationType }) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SEND_VERIFICATION_OTP_REQUEST });
    try {
      const response = await api.post(
        `/api/users/verification/${verificationType}/send-otp`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const user = response.data;
      dispatch({
        type: actionTypes.SEND_VERIFICATION_OTP_SUCCESS,
        payload: user,
      });
      console.log("send otp ", user);
    } catch (error) {
      console.log("error ", error);
      const errorMessage = error.message;
      dispatch({
        type: actionTypes.SEND_VERIFICATION_OTP_FAILURE,
        payload: errorMessage,
      });
    }
  };
};
//Изменения
export const verifyOtp = ({ jwt, otp }) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_OTP_REQUEST });
    try {
      const response = await api.patch(
        `/api/users/verification/verify-otp/${otp}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const user = response.data;
      dispatch({ type: actionTypes.VERIFY_OTP_SUCCESS, payload: user });
      console.log("verify otp ", user);
    } catch (error) {
      console.log("error ", error);
      const errorMessage = error?.response?.data?.message || "Invalid OTP";
      dispatch({
        type: actionTypes.VERIFY_OTP_FAILURE,
        payload: errorMessage,
      });

      throw new Error(errorMessage);
    }
  };
};

//Изменения
export const enableTwoStepAuthentication = ({ jwt, otp }) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
    try {
      const response = await api.patch(
        `/api/users/enable-two-factor/verify-otp/${otp}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      const user = response.data;
      dispatch({
        type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
        payload: user,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      dispatch({
        type: actionTypes.ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };
};

export const sendResetPassowrdOTP = ({
  sendTo,
  verificationType,
  navigate,
}) => {
  console.log("send otp ", sendTo);
  return async (dispatch) => {
    dispatch({ type: actionTypes.SEND_RESET_PASSWORD_OTP_REQUEST });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/users/reset-password/send-otp`,
        {
          sendTo,
          verificationType,
        }
      );
      const user = response.data;
      navigate(`/reset-password/${user.session}`);
      dispatch({
        type: actionTypes.SEND_RESET_PASSWORD_OTP_SUCCESS,
        payload: user,
      });
      console.log("otp sent successfully ", user);
    } catch (error) {
      console.log("error ", error);
      const errorMessage = error.message;
      dispatch({
        type: actionTypes.SEND_RESET_PASSWORD_OTP_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

export const verifyResetPassowrdOTP = ({
  otp,
  password,
  session,
  navigate,
}) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_RESET_PASSWORD_OTP_REQUEST });
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/auth/users/reset-password/verify-otp`,
        {
          otp,
          password,
        },
        {
          params: {
            id: session,
          },
        }
      );
      const user = response.data;
      dispatch({
        type: actionTypes.VERIFY_RESET_PASSWORD_OTP_SUCCESS,
        payload: user,
      });
      navigate("/password-update-successfully");
      console.log("VERIFY otp successfully ", user);
    } catch (error) {
      console.log("error ", error);
      const errorMessage = error.message;
      dispatch({
        type: actionTypes.VERIFY_RESET_PASSWORD_OTP_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.LOGOUT });
    localStorage.clear();
  };
};
//Редактирование профиля
export const setUser = (user) => ({
  type: actionTypes.SET_USER,
  payload: user,
});
