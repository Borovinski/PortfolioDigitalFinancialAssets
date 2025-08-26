import { paymentHandler } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { DotFilledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("STRIPE"); // Только Stripe
  const { wallet } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Пожалуйста, введите корректную сумму.");
      return;
    }

    dispatch(
      paymentHandler({
        jwt: localStorage.getItem("jwt"),
        paymentMethod,
        amount,
      })
    );
    console.log("Сумма:", amount, "Метод оплаты:", paymentMethod);
  };

  return (
    <div className="pt-10 space-y-5">
      <div>
        <h1 className="pb-1">Введите сумму</h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="py-7 text-lg"
          placeholder="$9999"
        />
      </div>

      <div>
        <h1 className="pb-1">Выберите платёжную систему</h1>
        <RadioGroup
          onValueChange={(value) => {
            setPaymentMethod(value);
          }}
          className="flex flex-wrap gap-5"
          defaultValue="STRIPE"
        >
          {/* Только Stripe */}
          <div className="flex items-center space-x-2 border p-3 px-5 rounded-md">
            <RadioGroupItem
              icon={DotFilledIcon}
              iconClassName="h-8 w-8"
              className="h-9 w-9"
              value="STRIPE"
              id="r2"
            />
            <Label htmlFor="r2">
              <div className="bg-white rounded-md px-5 py-2 w-32">
                <img
                  className="h-10"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/768px-Stripe_Logo%2C_revised_2016.svg.png"
                  alt="stripe"
                />
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {wallet.loading ? (
        <Skeleton className="py-7 w-full" />
      ) : (
        <Button onClick={handleSubmit} className="w-full py-7 text-xl">
          Пополнить
        </Button>
      )}
    </div>
  );
};

export default TopupForm;