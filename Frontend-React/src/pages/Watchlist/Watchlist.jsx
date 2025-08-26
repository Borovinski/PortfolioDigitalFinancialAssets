/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addItemToWatchlist,
  getUserWatchlist,
  removeItemFromWatchlist,
} from "@/Redux/Watchlist/Action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useToast } from "@/components/ui/use-toast";

const Watchlist = () => {
  const dispatch = useDispatch();
  const { watchlist } = useSelector((store) => store);

  const isVerified = useSelector(
    (store) => store.auth.user?.twoFactorAuth?.enabled === true
  );
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserWatchlist());
  }, []);

  const isCoinInWatchlist = (id) => {
    return watchlist.items.some((item) => item.id === id);
  };

  const handleWatchlistToggle = (coinId) => {
    if (!isVerified) {
      toast({
        title: "Доступ запрещён",
        description: "Пожалуйста, подтвердите ваш аккаунт для этой функции.",
        variant: "destructive",
      });
      return;
    }

    if (isCoinInWatchlist(coinId)) {
      dispatch(removeItemFromWatchlist(coinId));
    } else {
      dispatch(addItemToWatchlist(coinId));
    }
  };

  return (
    <div className="pt-8 lg:px-10">
      <div className="flex items-center pt-5 pb-10 gap-5">
        <BookmarkFilledIcon className="h-10 w-10" />
        <h1 className="text-4xl font-semibold">Список избранного</h1>
      </div>

      <Table className="px-5 lg:px-20 border-t border-x border-b p-10">
        <ScrollArea>
          <TableHeader>
            <TableRow className="sticky top-0 left-0 right-0 bg-background">
              <TableHead>Монета</TableHead>
              <TableHead>Символ</TableHead>
              <TableHead>Объём</TableHead>
              <TableHead>Рыночная капитализация</TableHead>
              <TableHead>24ч</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="text-right">Действие</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {watchlist.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/market/${item.id}`)}
                  className="font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage src={item.image} alt={item.symbol} />
                  </Avatar>
                  <span>{item.name}</span>
                </TableCell>
                <TableCell>{item.symbol.toUpperCase()}</TableCell>
                <TableCell>{item.total_volume}</TableCell>
                <TableCell>{item.market_cap}</TableCell>
                <TableCell
                  className={
                    item.market_cap_change_percentage_24h < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {item.market_cap_change_percentage_24h}%
                </TableCell>
                <TableCell>{item.current_price}</TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleWatchlistToggle(item.id)}
                    variant={isCoinInWatchlist(item.id) ? "destructive" : "outline"}
                    className="h-10 w-10"
                    size="icon"
                  >
                    <BookmarkFilledIcon
                      className={`h-6 w-6 ${!isCoinInWatchlist(item.id) ? "opacity-30" : ""}`}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </ScrollArea>
      </Table>
    </div>
  );
};

export default Watchlist;
