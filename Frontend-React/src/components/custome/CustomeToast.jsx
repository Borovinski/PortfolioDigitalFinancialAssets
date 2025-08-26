import React, { useEffect, useState } from 'react';

// Функция перевода ошибок
const translateMessage = (message) => {
  if (!message) return "Произошла ошибка";

  const translations = [
    { pattern: /invalid username or password/i, result: "Неверное имя пользователя или пароль" },
    { pattern: /user not found/i, result: "Пользователь с таким email не найден" },
    { pattern: /invalid password/i, result: "Неверный пароль" },
    { pattern: /email already exists/i, result: "Этот email уже используется" },
    { pattern: /unauthorized/i, result: "Доступ запрещён. Необходима авторизация" },
    { pattern: /jwt/i, result: "Ошибка авторизации. Попробуйте войти снова" },
    { pattern: /network error/i, result: "Ошибка сети. Проверьте соединение" },
  ];
  
  for (let t of translations) {
    if (t.pattern.test(message)) return t.result;
  }

  return message; // если перевод не найден — возвращаем как есть
};

const CustomeToast = ({ message, show, onClose }) => {
  const [showToast, setShowToast] = useState(false);

  const handleCloseToast = () => {
    setShowToast(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        handleCloseToast();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    setShowToast(show);
  }, [show]);

  if (!showToast) return null;

  return (
    <div
      className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-5 py-3 rounded-md shadow-lg flex items-center justify-between gap-4 max-w-md w-full z-[1000]"
      style={{ animation: 'slideDown 0.3s ease' }}
    >
      <span className="text-lg">⚠️ {translateMessage(message)}</span>
      <button onClick={handleCloseToast} className="text-white text-xl leading-none">×</button>
    </div>
  );
};

export default CustomeToast;
