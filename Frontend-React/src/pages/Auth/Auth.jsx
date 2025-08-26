import "./Auth.css";
import { Button } from "@/components/ui/button";

import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ForgotPasswordForm from "./ForgotPassword";
import { useSelector } from "react-redux";
import CustomeToast from "@/components/custome/CustomeToast";

//Импорт компонента с анимацией
import ParticlesBackground from "@/components/custome/ParticlesBackground";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);

  const [animate, setAnimate] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="authContainer h-screen relative">
      {/*Анимированный фон */}
      <ParticlesBackground />

      {/*Полупрозрачный затемнённый фон поверх анимации */}
      <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#030712] bg-opacity-50 z-[1]"></div>

      {/*Основной блок формы с блюром */}
      <div className="bgBlure absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 box flex flex-col justify-center items-center h-[42rem] w-[30rem] rounded-md z-50 bg-black bg-opacity-50 shadow-2xl shadow-white">
        <CustomeToast show={auth.error} message={auth.error?.error} />

        <div className="branding-title pb-9">
          <h1 className="text-6xl font-bold text-white">Crypto</h1>
          <div className="divider-line"></div>
          <h1 className="text-6xl font-bold text-white ml-4">Portfolio</h1>
        </div>

        {location.pathname === "/signup" ? (
          <section className={`w-full login ${animate ? "slide-down" : "slide-up"}`}>
            <div className="loginBox w-full px-10 space-y-5">
              <SignupForm />

              <div className="flex items-center justify-center">
                <span>Уже есть аккаунт?</span>
                <Button onClick={() => handleNavigation("/signin")} variant="ghost">
                  Войти
                </Button>
              </div>
            </div>
          </section>
        ) : location.pathname === "/forgot-password" ? (
          <section className="p-5 w-full">
            <ForgotPasswordForm />
            <div className="flex items-center justify-center mt-5">
              <span>Назад ко входу?</span>
              <Button onClick={() => navigate("/signin")} variant="ghost">
                Войти
              </Button>
            </div>
          </section>
        ) : (
          <section className="w-full login">
            <div className="loginBox w-full px-10 space-y-5">
              <LoginForm />

              <div className="flex items-center justify-center">
                <span>Нет аккаунта?</span>
                <Button onClick={() => handleNavigation("/signup")} variant="ghost">
                  Зарегистрироваться
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  onClick={() => navigate("/forgot-password")}
                  variant="outline"
                  className="w-full py-5"
                >
                  Забыли пароль?
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Auth;
