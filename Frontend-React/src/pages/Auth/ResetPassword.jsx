import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { verifyResetPassowrdOTP } from "@/Redux/Auth/Action";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import * as yup from "yup";
import "./login/Login.css"; // 👈 Подключаем твои стили со светящейся рамкой

const formSchema = yup.object({
  password: yup
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .required("Пароль обязателен"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Пароли должны совпадать")
    .required("Подтвердите пароль"),
  otp: yup
    .string()
    .min(6, "OTP должен содержать 6 символов")
    .required("Введите OTP"),
});

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useParams();

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
      otp: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(
      verifyResetPassowrdOTP({
        otp: data.otp,
        password: data.password,
        session,
        navigate,
      })
    );
    console.log("reset password form", data);
  };

  return (
    <div className="login-wrapper">
      <div className="box">
        <div className="space-y-5 w-full text-white">
          <h1 className="text-center text-2xl font-bold pb-5">
            Сброс пароля
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="pb-2 text-sm font-medium">Подтвердите OTP</h2>
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP {...field} maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <h2 className="pt-4 pb-2 text-sm font-medium">Новый пароль</h2>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border border-gray-600 bg-[#1e1e2e] text-white py-4 px-5 rounded-md placeholder:text-gray-400"
                        placeholder="Введите новый пароль"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border border-gray-600 bg-[#1e1e2e] text-white py-4 px-5 rounded-md placeholder:text-gray-400"
                        placeholder="Подтвердите пароль"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
              >
                Сменить пароль
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
