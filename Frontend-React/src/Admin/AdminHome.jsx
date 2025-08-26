import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/Redux/Auth/Action";

import { Button } from "@/components/ui/button";
import { UsersIcon, BanknoteIcon } from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import { API_BASE_URL } from "@/Api/api";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ParticlesBackground from "@/components/custome/ParticlesBackground";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    pendingWithdrawals: 0,
  });

  const [showUsersSection, setShowUsersSection] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (showUsersSection) {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          });

          const usersWithNumericRoles = res.data.map((u) => ({
            ...u,
            role: u.role === "ROLE_ADMIN" ? 0 : 1,
          }));

          setUsers(usersWithNumericRoles);
        } catch (error) {
          console.error("Ошибка при получении пользователей", error);
        }
      };

      fetchUsers();
    }
  }, [showUsersSection]);

  const handleToggleLock = async (userId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/toggle-lock`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, accountNonLocked: !u.accountNonLocked } : u
        )
      );
    } catch (error) {
      console.error("Ошибка при блокировке/разблокировке", error);
    }
  };

  const handleChangeRole = async (userId, currentRole) => {
    try {
      const nextRole = currentRole === 0 ? 1 : 0;
      await axios.patch(
        `${API_BASE_URL}/api/admin/users/${userId}/change-role?role=${nextRole}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch (error) {
      console.error("Ошибка при смене роли", error);
    }
  };

  const adminMenu = [
    {
      name: "Пользователи",
      action: () => setShowUsersSection((prev) => !prev),
      icon: <UsersIcon className="h-6 w-6" />,
    },
    {
      name: "Запросы на вывод",
      action: () => navigate("/admin/withdrawal"),
      icon: <BanknoteIcon className="h-6 w-6" />,
    },
    {
      name: "Выйти",
      action: () => {
        dispatch(logout());
        navigate("/signin");
      },
      icon: <ExitIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticlesBackground />

      <div className="relative z-10 p-6 text-white">
        <h1 className="text-2xl font-bold mb-6">📊 Панель администратора</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="👥 Всего пользователей" value={stats.totalUsers} />
          <StatCard title="✅ Верифицированные" value={stats.verifiedUsers} />
          <StatCard title="❌ Неверифицированные" value={stats.unverifiedUsers} />
          <StatCard title="💸 Ожидают вывода" value={stats.pendingWithdrawals} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          {adminMenu.map((item) => (
            <Button
              key={item.name}
              onClick={item.action}
              variant="outline"
              className="flex items-center gap-4 py-5 px-6 w-full sm:w-auto justify-start text-left"
            >
              <div className="w-6 flex justify-center">{item.icon}</div>
              <span>{item.name}</span>
            </Button>
          ))}
        </div>

        {showUsersSection && (
          <div className="transition-all duration-500 ease-in-out transform opacity-100 scale-100">
            <div className="px-4 md:px-10">
              <h1 className="text-2xl font-bold py-6">Пользователи:</h1>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>2FA</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const isAdmin = user.role === 0;

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>{isAdmin ? "Админ" : "Пользователь"}</TableCell>
                        <TableCell>
                          <Badge
                            className={user.accountNonLocked ? "bg-green-500" : "bg-red-600"}
                          >
                            {user.accountNonLocked ? "Активен" : "Заблокирован"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.twoFactorAuth?.enabled ? "Да" : "Нет"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isAdmin}
                            className={isAdmin ? "opacity-50 cursor-not-allowed" : ""}
                            onClick={() => handleToggleLock(user.id)}
                          >
                            {user.accountNonLocked ? "Заблокировать" : "Разблокировать"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isAdmin}
                            className={isAdmin ? "opacity-50 cursor-not-allowed" : ""}
                            onClick={() => handleChangeRole(user.id, user.role)}
                          >
                            Сменить роль
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-md border border-gray-700">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default AdminHome;