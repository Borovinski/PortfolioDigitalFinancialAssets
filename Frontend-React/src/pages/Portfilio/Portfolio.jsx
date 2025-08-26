/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAssets,
  getUserAssetProfitability,
} from "@/Redux/Assets/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TreadingHistory from "./TreadingHistory";
import PortfolioDiversification from "@/components/PortfolioDiversification";
import PortfolioOptimization from "@/components/PortfolioOptimization";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const [showProfitability, setShowProfitability] = useState(false);
  const { asset } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (currentTab === "portfolio") {
      dispatch(getUserAssets(jwt));
      dispatch(getUserAssetProfitability(jwt));
    }
  }, [currentTab, dispatch]);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  return (
    <div className="px-10 py-5 mt-10">
      <div className="pb-5 flex items-center gap-5">
        <Select onValueChange={handleTabChange} defaultValue="portfolio">
          <SelectTrigger className="w-[200px] py-[1.2rem]">
            <SelectValue placeholder="Выберите раздел" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="portfolio">Портфель</SelectItem>
            <SelectItem value="history">История</SelectItem>
            <SelectItem value="diversification">Диверсификация</SelectItem>
            <SelectItem value="optimize">Оптимизация</SelectItem>
          </SelectContent>
        </Select>

        {currentTab === "portfolio" && (
          <Button
            onClick={() => setShowProfitability(!showProfitability)}
            className="ml-auto"
          >
            {showProfitability
              ? "Показать изменение за сутки"
              : "Показать мою доходность"}
          </Button>
        )}
      </div>

      {currentTab === "portfolio" ? (
        <Table className="px-5 relative">
          <TableHeader className="py-9">
            <TableRow className="sticky top-0 left-0 right-0 bg-background">
              <TableHead className="py-3">Актив</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Количество</TableHead>
              <TableHead>
                {showProfitability ? "Профит ($)" : "Изменение"}
              </TableHead>
              <TableHead>
                {showProfitability ? "Доходность (%)" : "Изм. (%)"}
              </TableHead>
              <TableHead className="text-right">Общая стоимость</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {asset.userAssets?.map((item) => {
              const profitItem = asset.profitability?.find(
                (p) =>
                  p.symbol?.trim().toLowerCase() ===
                  item.coin.symbol?.trim().toLowerCase()
              );

              return (
                <TableRow
                  onClick={() => navigate(`/market/${item.coin.id}`)}
                  key={item.id}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <Avatar className="-z-50">
                      <AvatarImage
                        src={item.coin.image}
                        alt={item.coin.symbol}
                      />
                    </Avatar>
                    <span>{item.coin.name}</span>
                  </TableCell>

                  <TableCell>{item.coin.current_price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>

                  <TableCell
                    className={`${(showProfitability
                        ? profitItem?.profit
                        : item.coin.price_change_24h) < 0
                        ? "text-red-600"
                        : "text-green-600"
                      }`}
                  >
                    {showProfitability
                      ? profitItem?.profit?.toFixed(2) ?? "-"
                      : item.coin.price_change_24h}
                  </TableCell>

                  <TableCell
                    className={`${(showProfitability
                        ? profitItem?.profitPercent
                        : item.coin.price_change_percentage_24h) < 0
                        ? "text-red-600"
                        : "text-green-600"
                      }`}
                  >
                    {showProfitability
                      ? (profitItem?.profitPercent?.toFixed(2) ?? "-") + "%"
                      : item.coin.price_change_percentage_24h + "%"}
                  </TableCell>

                  <TableCell className="text-right">
                    {(item.coin.current_price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : currentTab === "history" ? (
        <TreadingHistory />
      ) : currentTab === "diversification" ? (
        <PortfolioDiversification />
      ) : currentTab === "optimize" ? (
        <PortfolioOptimization
          onSuccess={() => {
            dispatch(getUserAssets(jwt));
            dispatch(getUserAssetProfitability(jwt));
          }}
        />
      ) : null}
    </div>
  );
};

export default Portfolio;