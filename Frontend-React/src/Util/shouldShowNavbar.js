export function shouldShowNavbar(currentPath, routes, userRole) {
  if (!userRole) userRole = "ROLE_USER";

  // Функция для преобразования маршрута с параметрами в регулярку
  const pathToRegex = (path) =>
    new RegExp("^" + path.replace(/:\w+/g, "\\w+") + "$");

  // Ищем маршрут, соответствующий текущему пути
  const matchedRoute = routes.find((route) =>
    pathToRegex(route.path).test(currentPath)
  );

  // Показываем Navbar только если роль маршрута — обычный пользователь
  return matchedRoute?.role === "ROLE_USER";
}
