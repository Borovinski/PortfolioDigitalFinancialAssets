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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/Redux/Auth/Action";
import { useNavigate } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { useToast } from "@/components/ui/use-toast";
import "./Login.css";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(login(data));
    // console.log("Отправка формы входа:", data);
  };

  useEffect(() => {
    // Редирект после логина по числовой роли
    if (auth.user) {
      if (auth.user.role === 0) {
        // 0 — это админ
        navigate("/admin");
      } else if (auth.user.role === 1) {
        // 1 — обычный пользователь
        navigate("/");
      }
    }
  }, [auth.user, navigate]);

  return (
    <div className="space-y-6 login-fade-in">
      <h1 className="text-center text-2xl font-bold text-white">Вход</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border border-gray-600 bg-[#1e1e2e] text-white py-4 px-5 rounded-md placeholder:text-gray-400"
                    placeholder="Электронная почта"
                  />
                </FormControl>
                <FormMessage className="form-message-error" />
              </FormItem>
            )}
          />

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
                    placeholder="Пароль"
                  />
                </FormControl>
                <FormMessage className="form-message-error" />
              </FormItem>
            )}
          />

          {!auth.loading ? (
            <Button
              type="submit"
              className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
            >
              Войти
            </Button>
          ) : (
            <SpinnerBackdrop show={true} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
