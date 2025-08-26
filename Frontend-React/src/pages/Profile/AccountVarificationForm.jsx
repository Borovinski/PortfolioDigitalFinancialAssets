/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { sendVerificationOtp } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AccountVarificationForm = ({ handleSubmit }) => {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);

  const handleSendOtp = (verificationType) => {
    dispatch(
      sendVerificationOtp({
        verificationType,
        jwt: localStorage.getItem("jwt"),
      })
    );
  };

  const onSubmitOtp = async () => {
    console.log("Отправка OTP:", value); // 🔍 лог

    try {
      await handleSubmit(value); // передаём OTP в функцию родителя
    } catch (error) {
      console.error("Ошибка проверки OTP:", error?.message || error);

      import("@/components/ui/use-toast").then(({ toast }) => {
        toast({
          title: "Проверка не удалась",
          description:
            error?.response?.data?.message || "Неверный OTP. Попробуйте снова.",
          variant: "destructive",
        });
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="space-y-5 mt-10 w-full">
        <div className="flex justify-between items-center">
          <p>Email:</p>
          <p>{auth.user?.email}</p>

          <Dialog>
            <DialogTrigger>
              <Button onClick={() => handleSendOtp("EMAIL")}>Отправить OTP</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="px-10 pt-5 text-center">
                  Введите OTP
                </DialogTitle>
              </DialogHeader>

              <div className="py-5 flex gap-10 justify-center items-center">
                <InputOTP
                  value={value}
                  onChange={(val) => setValue(val)}
                  maxLength={6}
                >
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

                <DialogClose>
                  <Button onClick={onSubmitOtp} className="w-[10rem]">
                    Подтвердить
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountVarificationForm;
