import { transferMoney } from "@/Redux/Wallet/Action";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";

const TransferForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!formData.walletId || isNaN(formData.walletId)) {
      alert("ID кошелька должен быть числом!");
      return;
    }

    if (!formData.amount || isNaN(formData.amount)) {
      alert("Сумма должна быть числом!");
      return;
    }

    dispatch(
      transferMoney({
        jwt: localStorage.getItem("jwt"),
        walletId: Number(formData.walletId),
        reqData: {
          amount: Number(formData.amount),
          purpose: formData.purpose,
        },
      })
    );
  };


  return (
    <div className="pt-10 space-y-5">
      <div>
        <h1 className="pb-1">Введите сумму</h1>
        <Input
          name="amount"
          onChange={handleChange}
          value={formData.amount}
          className="py-7"
          placeholder="$9999"
        />
      </div>

      <div>
        <h1 className="pb-1">ID кошелька получателя</h1>
        <Input
          name="walletId"
          onChange={handleChange}
          value={formData.walletId}
          className="py-7"
          placeholder="#ADFE34456"
        />
      </div>

      <div>
        <h1 className="pb-1">Назначение перевода</h1>
        <Input
          name="purpose"
          onChange={handleChange}
          value={formData.purpose}
          className="py-7"
          placeholder="ваше сообщение..."
        />
      </div>

      <DialogClose>
        <Button
          onClick={handleSubmit}
          variant=""
          className="w-full p-7 text-xl"
        >
          Отправить
        </Button>
      </DialogClose>
    </div>
  );
};

export default TransferForm;