import { Button } from "@/components/ui/button";
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import SideBar from "../SideBar/SideBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ исправлено: теперь не перерендеривается весь стейт
  const user = useSelector((state) => state.auth.user);

  const handleNavigate = () => {
    if (!user) return;
    user.role === "ROLE_ADMIN"
      ? navigate("/admin/withdrawal")
      : navigate("/profile");
  };

  return (
    <div className="px-2 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="rounded-full h-11 w-11"
              variant="ghost"
              size="icon"
            >
              <DragHandleHorizontalIcon className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-72 border-r-0 flex flex-col justify-center"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://cdn.pixabay.com/photo/2021/04/30/16/47/binance-logo-6219389_1280.png" />
                  </Avatar>
                  <div>
                    <span className="font-bold text-orange-700">Crypto</span>
                    <span>Portfolio</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <SideBar />
          </SheetContent>
        </Sheet>

        <p
          onClick={() => navigate("/")}
          className="text-sm lg:text-base cursor-pointer"
        >
          Crypto Portfolio
        </p>

        <div className="p-0 ml-9">
          <Button
            variant="outline"
            onClick={() => navigate("/search")}
            className="flex items-center gap-3"
          >
            <MagnifyingGlassIcon className="left-2 top-3" />
            <span>Поиск</span>
          </Button>
        </div>
      </div>

      <div>
        <Avatar className="cursor-pointer" onClick={handleNavigate}>
          {!user ? (
            <AvatarIcon className="h-8 w-8" />
          ) : (
            <AvatarFallback>
              {user.fullName?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  );
};

export default Navbar;
