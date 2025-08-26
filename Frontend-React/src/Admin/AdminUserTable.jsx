import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/Api/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Ошибка при получении пользователей", error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleLock = async (userId) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/users/${userId}/toggle-lock`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
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
      const nextRole = currentRole === "ROLE_ADMIN" ? 0 : 1; // 0 — USER, 1 — ADMIN
      await axios.patch(`${API_BASE_URL}/api/admin/users/${userId}/change-role?role=${nextRole}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, role: nextRole === 0 ? "ROLE_USER" : "ROLE_ADMIN" }
            : u
        )
      );
    } catch (error) {
      console.error("Ошибка при смене роли", error);
    }
  };

  return (
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.fullName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge
                  className={
                    user.accountNonLocked ? "bg-green-500" : "bg-red-600"
                  }
                >
                  {user.accountNonLocked ? "Активен" : "Заблокирован"}
                </Badge>
              </TableCell>
              <TableCell>
                {user.twoFactorAuth?.enabled ? "Да" : "Нет"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleToggleLock(user.id)}
                >
                  {user.accountNonLocked ? "Заблокировать" : "Разблокировать"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleChangeRole(user.id, user.role)}
                >
                  Сменить роль
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUserTable;
