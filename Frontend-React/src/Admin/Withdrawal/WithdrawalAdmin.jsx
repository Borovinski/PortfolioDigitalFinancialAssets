import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ добавляем навигацию

import {
  getAllWithdrawalRequest,
  getWithdrawalHistory,
  proceedWithdrawal,
} from "@/Redux/Withdrawal/Action";

import { readableTimestamp } from "@/Util/readbaleTimestamp";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ParticlesBackground from "@/components/custome/ParticlesBackground";


const WithdrawalAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ инициализируем navigate

  const { withdrawal } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getAllWithdrawalRequest(localStorage.getItem("jwt")));
  }, []);

  const handleProccedWithdrawal = (id, accept) => {
    dispatch(proceedWithdrawal({ jwt: localStorage.getItem("jwt"), id, accept }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10 px-20 text-white">
        {/* КНОПКА НАЗАД */}
        <div className="pt-6">
          <Button variant="outline" onClick={() => navigate("/admin/home")}>
            ← Назад к панели
          </Button>
        </div>

        <h1 className="text-3xl font-bold py-10">Все заявки на вывод средств</h1>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-5">Дата</TableHead>
                <TableHead className="py-5">Пользователь</TableHead>
                <TableHead>Метод</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead className="text-right">Статус</TableHead>
                <TableHead className="text-right">Обработка</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {withdrawal.requests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium py-5">
                    {readableTimestamp(item?.date)}
                  </TableCell>

                  <TableCell>
                    <p className="font-bold">{item.user.fullName}</p>
                    <p className="text-gray-300">{item.user.email}</p>
                  </TableCell>

                  <TableCell>{"Банковский счёт"}</TableCell>

                  <TableCell className="text-green-500">
                    {item.amount} USD
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      className={`text-white ${item.status === "PENDING"
                          ? "bg-red-500"
                          : "bg-green-500"
                        }`}
                    >
                      {item.status === "PENDING" ? "В ожидании" : "Принято"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <Button variant="outline">Обработать</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Button
                            onClick={() => handleProccedWithdrawal(item.id, true)}
                            className="w-full bg-green-500 text-white hover:text-black"
                          >
                            Принять
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            onClick={() => handleProccedWithdrawal(item.id, false)}
                            className="w-full bg-red-500 text-white hover:text-black"
                          >
                            Отклонить
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalAdmin;
