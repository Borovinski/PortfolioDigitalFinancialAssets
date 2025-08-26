import { logout } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  ExitIcon,
  BookmarkIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, WalletIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Переведённое меню
const menu = [
  { name: "Главная", path: "/", icon: <HomeIcon className="h-6 w-6" /> },
  { name: "Портфель", path: "/portfolio", icon: <DashboardIcon className="h-6 w-6" /> },
  { name: "Избранное", path: "/watchlist", icon: <BookmarkIcon className="h-6 w-6" /> },
  { name: "Активность", path: "/activity", icon: <ActivityLogIcon className="h-6 w-6" /> },
  { name: "Кошелек", path: "/wallet", icon: <WalletIcon className="h-6 w-6" /> },
  { name: "Платежные данные", path: "/payment-details", icon: <LandmarkIcon className="h-6 w-6" /> },
  { name: "Вывод средств", path: "/withdrawal", icon: <CreditCardIcon className="h-6 w-6" /> },
  { name: "Профиль", path: "/profile", icon: <PersonIcon className="h-6 w-6" /> },
  { name: "Выйти", path: "/", icon: <ExitIcon className="h-6 w-6" /> },
];

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const isVerified = useSelector((store) => store.auth.user?.twoFactorAuth?.enabled);

  const blockedForUnverified = [
    "Избранное",
    "Портфель",
    "Активность",
    "Кошелек",
    "Платежные данные",
    "Вывод средств",
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (item) => {
    if (item.name === "Выйти") {
      handleLogout();
      navigate(item.path);
    } else if (blockedForUnverified.includes(item.name) && !isVerified) {
      toast({
        title: "Требуется верификация",
        description: `Пожалуйста, подтвердите аккаунт, чтобы использовать "${item.name}".`,
        variant: "destructive",
      });
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="mt-10 space-y-5">
      {menu.map((item) => (
        <div key={item.name}>
          <SheetClose asChild>
            <Button
              onClick={() => handleMenuClick(item)}
              variant="outline"
              className={`flex items-center gap-5 py-6 w-full text-left
          ${blockedForUnverified.includes(item.name) && !isVerified
                  ? "border border-red-600 text-red-600 bg-red-50"
                  : ""}`}
            >
              <div className="w-8 flex justify-center">
                <div className="h-6 w-6 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <p>{item.name}</p>
            </Button>
          </SheetClose>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
