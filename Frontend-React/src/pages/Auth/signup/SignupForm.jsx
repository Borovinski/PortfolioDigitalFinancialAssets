/* eslint-disable no-unused-vars */
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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/Redux/Auth/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const formSchema = z.object({
  fullName: z.string().nonempty("Поле имени обязательно для заполнения"),
  email: z.string().email("Неверный формат email").optional(),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .optional(),
});

const SignupForm = () => {
  const { auth } = useSelector((store) => store);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const onSubmit = (data) => {
    data.navigate = navigate;
    dispatch(register(data));
    console.log("Форма регистрации", data);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-center text-xl font-semibold text-white">Создать аккаунт</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5 bg-[#1e1e2e] text-white"
                    placeholder="Ваше имя"
                  />
                </FormControl>
                <FormMessage className="form-message-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border w-full border-gray-700 py-5 px-5 bg-[#1e1e2e] text-white"
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
                    className="border w-full border-gray-700 py-5 px-5 bg-[#1e1e2e] text-white"
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
              className="w-full py-5 text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
            >
              Зарегистрироваться
            </Button>
          ) : (
            <SpinnerBackdrop show={true} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;