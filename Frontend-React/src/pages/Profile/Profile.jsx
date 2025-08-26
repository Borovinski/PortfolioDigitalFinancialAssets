import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountVarificationForm from "./AccountVarificationForm";
import { VerifiedIcon } from "lucide-react";
import { enableTwoStepAuthentication, verifyOtp, setUser } from "@/Redux/Auth/Action";
import { useToast } from "@/components/ui/use-toast";
import { getUser } from "@/Redux/Auth/Action";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: auth.user.fullName || "",
    address: auth.user.address || "",
    city: auth.user.city || "",
    postcode: auth.user.postcode || "",
    country: auth.user.country || "",
    nationality: auth.user.nationality || "",
    dateOfBirth: auth.user.dateOfBirth || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormChanged = () => {
    return (
      form.fullName.trim() !== (auth.user.fullName || "").trim() ||
      form.address.trim() !== (auth.user.address || "").trim() ||
      form.city.trim() !== (auth.user.city || "").trim() ||
      form.postcode.trim() !== (auth.user.postcode || "").trim() ||
      form.country.trim() !== (auth.user.country || "").trim() ||
      form.nationality.trim() !== (auth.user.nationality || "").trim() ||
      form.dateOfBirth !== (auth.user.dateOfBirth || "")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");

    if (!isFormChanged()) {
      toast({
        title: "Изменения не обнаружены",
        description: "Вы не изменили информацию профиля.",
        className: "bg-yellow-500 text-white",
      });
      setOpen(false);
      return;
    }

    try {
      const res = await axios.put("http://localhost:5454/api/users/profile", form, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      dispatch(setUser(res.data));
      setOpen(false);
      toast({
        title: "Успешно!",
        description: "Профиль обновлён успешно!",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
      toast({
        title: "Обновление не удалось",
        description: "Произошла ошибка при обновлении профиля.",
        variant: "destructive",
      });
    }
  };

  const handleEnableTwoStepVerification = async (otp) => {
    const jwt = localStorage.getItem("jwt");
    const res = await dispatch(enableTwoStepAuthentication({ jwt, otp }));

    if (res?.payload?.status === 400 || res?.error) {
      toast({
        title: "Проверка не удалась",
        description: res?.error?.message || "Неверный OTP. Попробуйте снова.",
        variant: "destructive",
      });
      return;
    }

    await dispatch(getUser(jwt));

    toast({
      title: "2FA включена",
      description: "Двухэтапная проверка успешно включена!",
      className: "bg-green-500 text-white",
    });

    setVerifyDialogOpen(false);
  };

  const handleVerifyOtp = async (otp) => {
    const jwt = localStorage.getItem("jwt");

    try {
      const res = await dispatch(verifyOtp({ jwt, otp }));

      if (res?.type?.includes("FAILURE")) {
        throw new Error("Проверка OTP не удалась");
      }

      await dispatch(getUser(jwt));

      toast({
        title: "Успешно!",
        description: "Аккаунт успешно подтверждён!",
        className: "bg-green-500 text-white",
      });

      setVerifyDialogOpen(false);
    } catch (err) {
      console.error("Ошибка в handleVerifyOtp:", err);

      toast({
        title: "Проверка не удалась",
        description: err?.message || "Неверный OTP. Попробуйте снова.",
        variant: "destructive",
      });

      return Promise.reject(err);
    }
  };

  const { toast } = useToast();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9 flex justify-between items-center">
            <CardTitle>Ваша информация</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Редактировать профиль</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Редактировать профиль</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label>Полное имя</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="text" name="fullName" value={form.fullName} onChange={handleChange} /></div>
                  <div><label>Адрес</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="text" name="address" value={form.address} onChange={handleChange} /></div>
                  <div><label>Город</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="text" name="city" value={form.city} onChange={handleChange} /></div>
                  <div><label>Почтовый индекс</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="text" name="postcode" value={form.postcode} onChange={handleChange} /></div>
                  <div><label>Страна</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="text" name="country" value={form.country} onChange={handleChange} /></div>
                  <div><label>Национальность</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="text" name="nationality" value={form.nationality} onChange={handleChange} /></div>
                  <div><label>Дата рождения</label><input className="w-full px-3 py-2 rounded bg-white text-black" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} /></div>
                  <Button type="submit">Сохранить</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex"><p className="w-[9rem]">Email:</p><p className="text-gray-500">{auth.user?.email}</p></div>
                <div className="flex"><p className="w-[9rem]">Полное имя:</p><p className="text-gray-500">{auth.user?.fullName}</p></div>
                <div className="flex"><p className="w-[9rem]">Дата рождения:</p><p className="text-gray-500">{auth.user?.dateOfBirth}</p></div>
                <div className="flex"><p className="w-[9rem]">Национальность:</p><p className="text-gray-500">{auth.user?.nationality}</p></div>
              </div>
              <div className="space-y-7">
                <div className="flex"><p className="w-[9rem]">Адрес:</p><p className="text-gray-500">{auth.user?.address}</p></div>
                <div className="flex"><p className="w-[9rem]">Город:</p><p className="text-gray-500">{auth.user?.city}</p></div>
                <div className="flex"><p className="w-[9rem]">Индекс:</p><p className="text-gray-500">{auth.user?.postcode}</p></div>
                <div className="flex"><p className="w-[9rem]">Страна:</p><p className="text-gray-500">{auth.user?.country}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Двухэтапная аутентификация */}
        <div className="mt-6">
          <Card className={`w-full border-2 ${auth.user.twoFactorAuth?.enabled ? "border-green-500" : "border-red-500"}`}>
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>Двухэтапная проверка</CardTitle>
                {auth.user.twoFactorAuth?.enabled ? (
                  <Badge className="space-x-2 text-white bg-green-600">
                    <VerifiedIcon /> <span>Включена</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500">Отключена</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={auth.user.twoFactorAuth?.enabled}>Включить 2FA</Button>
                </DialogTrigger>
                {!auth.user.twoFactorAuth?.enabled && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="px-10 pt-5 text-center">
                        Введите OTP, чтобы включить 2FA
                      </DialogTitle>
                    </DialogHeader>
                    <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Статус аккаунта и смена пароля */}
        <div className="lg:flex gap-5 mt-5">
          <Card className="w-full">
            <CardHeader className="pb-7">
              <CardTitle>Сменить пароль</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center">
                <p className="w-[8rem]">Email :</p>
                <p>{auth.user.email}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[8rem]">Пароль :</p>
                <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Сменить пароль</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl">Сменить пароль</DialogTitle>
                    </DialogHeader>
                    <form
                      className="space-y-4"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const { currentPassword, newPassword, confirmPassword } = passwordForm;
                        const jwt = localStorage.getItem("jwt");

                        if (newPassword !== confirmPassword) {
                          toast({
                            title: "Ошибка",
                            description: "Пароли не совпадают.",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          await axios.put(
                            "http://localhost:5454/api/users/change-password",
                            {
                              currentPassword,
                              newPassword,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${jwt}`,
                              },
                            }
                          );

                          toast({
                            title: "Успешно",
                            description: "Пароль обновлён!",
                            className: "bg-green-500 text-white",
                          });

                          // очищаем форму и закрываем модалку
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setChangePasswordDialogOpen(false);

                        } catch (err) {
                          console.error("Ошибка смены пароля:", err);
                          toast({
                            title: "Ошибка",
                            description: err.response?.data?.message || "Не удалось изменить пароль.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <div>
                        <label>Текущий пароль</label>
                        <input
                          type="password"
                          name="currentPassword"
                          className="w-full px-3 py-2 rounded bg-white text-black"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label>Новый пароль</label>
                        <input
                          type="password"
                          name="newPassword"
                          className="w-full px-3 py-2 rounded bg-white text-black"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label>Подтверждение нового пароля</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="w-full px-3 py-2 rounded bg-white text-black"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Обновить пароль
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;