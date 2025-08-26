/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { invoices } from "../Home/AssetTable";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { getUserAssets } from "@/Redux/Assets/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAllOrdersForUser } from "@/Redux/Order/Action";
import { calculateProfite } from "@/Util/calculateProfite";
import { readableDate } from "@/Util/readableDate";

const TreadingHistory = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset, order } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
    dispatch(getAllOrdersForUser({ jwt: localStorage.getItem("jwt") }));
  }, []);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  return (
    <div className="">
      <Table className="px-5 relative">
        <TableHeader className="py-9">
          <TableRow className="sticky top-0 left-0 right-0 bg-background">
            <TableHead className="py-3">Дата и Время</TableHead>
            <TableHead>Торговая пара</TableHead>
            <TableHead>Цена покупки</TableHead>
            <TableHead>Цена продажи</TableHead>
            <TableHead>Тип ордера</TableHead>
            <TableHead>Прибыль/Убыток</TableHead>
            <TableHead className="text-right">Стоимость сделки</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {order.orders?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <p>{readableDate(item.timestamp).date}</p>
                <p className="text-gray-400">
                  {readableDate(item.timestamp).time}
                </p>
              </TableCell>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="-z-50">
                  <AvatarImage
                    src={item.orderItem.coin.image}
                    alt={item.orderItem.coin.symbol}
                  />
                </Avatar>
                <span>{item.orderItem.coin.name}</span>
              </TableCell>

              <TableCell>${item.orderItem.buyPrice}</TableCell>
              <TableCell>
                {item.orderItem.sellPrice ? "$" + item.orderItem.sellPrice : "-"}
              </TableCell>
              <TableCell>
                {item.orderType === "BUY" ? "Покупка" : "Продажа"}
              </TableCell>
              <TableCell
                className={`${
                  calculateProfite(item) < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {item.orderType === "SELL" ? calculateProfite(item) : "-"}
              </TableCell>
              <TableCell className="text-right">
                ${item.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TreadingHistory;
