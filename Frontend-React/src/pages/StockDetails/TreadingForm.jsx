import { getAssetDetails } from "@/Redux/Assets/Action";
import { payOrder } from "@/Redux/Order/Action";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DotIcon } from "@radix-ui/react-icons";
import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { getUserWallet } from "@/Redux/Wallet/Action";

const TreadingForm = ({ onSuccess }) => {
  const { coin, asset, wallet } = useSelector((store) => store);
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("BUY");
  const { toast } = useToast();

  const handleOnChange = (e) => {
    const inputAmount = e.target.value;
    setAmount(inputAmount);
    const volume = calculateBuyCost(
      inputAmount,
      coin.coinDetails.market_data.current_price.usd
    );
    setQuantity(volume);
  };

  const calculateBuyCost = (amountUSD, cryptoPrice) => {
    const volume = amountUSD / cryptoPrice;
    const decimalPlaces = Math.max(2, cryptoPrice.toString().split(".")[0].length);
    return parseFloat(volume.toFixed(decimalPlaces));
  };

  const handleBuyCrypto = async () => {
    const parsedQuantity = parseFloat(quantity);

    const orderPayload = {
      jwt: localStorage.getItem("jwt"),
      coinId: coin.coinDetails?.id,
      quantity: parsedQuantity,
      orderType,
    };

    try {
      await dispatch(payOrder(orderPayload));

      toast({
        title: "Успешно!",
        description: `${orderType === "BUY" ? "Куплено" : "Продано"} ${parsedQuantity} ${coin.coinDetails?.symbol?.toUpperCase()}`,
      });

      // Обновляем данные
      dispatch(getUserWallet(localStorage.getItem("jwt")));
      dispatch(getAssetDetails({
        coinId: coin.coinDetails.id,
        jwt: localStorage.getItem("jwt"),
      }));

      setAmount(0);
      setQuantity(0);

      if (onSuccess) onSuccess();

    } catch (error) {
      toast({
        title: "Ошибка при создании ордера",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  // Подгружаем изначальные данные
  useEffect(() => {
    dispatch(getAssetDetails({
      coinId: coin.coinDetails.id,
      jwt: localStorage.getItem("jwt"),
    }));
  }, []);

  // При изменении баланса пересчитываем
  useEffect(() => {
    if (amount && coin.coinDetails?.market_data.current_price.usd) {
      const volume = calculateBuyCost(amount, coin.coinDetails.market_data.current_price.usd);
      setQuantity(volume);
    }
  }, [wallet.userWallet?.balance]);

  return (
    <div className="space-y-10 p-5">
      <div>
        <div className="flex gap-4 items-center justify-between">
          <Input
            className="py-7 focus:outline-none"
            placeholder="Введите сумму..."
            value={amount}
            onChange={handleOnChange}
            type="number"
          />
          <div>
            <p className="border text-2xl flex justify-center items-center w-36 h-14 rounded-md">
              {quantity}
            </p>
          </div>
        </div>

        {orderType === "SELL"
          ? asset.assetDetails?.quantity * coin.coinDetails?.current_price < amount && (
            <h1 className="text-red-800 text-center pt-4">
              Недостаточно монет для продажи
            </h1>
          )
          : quantity * coin.coinDetails?.market_data.current_price.usd > wallet.userWallet?.balance && (
            <h1 className="text-red-800 text-center pt-4">
              Недостаточно средств на кошельке для покупки
            </h1>
          )}
      </div>

      <div className="flex gap-5 items-center">
        <Avatar>
          <AvatarImage src={coin.coinDetails?.image.large} />
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p>{coin.coinDetails?.symbol?.toUpperCase()}</p>
            <DotIcon className="text-gray-400" />
            <p className="text-gray-400">{coin.coinDetails?.name}</p>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold">
              {coin.coinDetails?.market_data.current_price.usd}
            </p>
            <p
              className={`${
                coin.coinDetails?.market_data.market_cap_change_24h < 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              <span>
                {coin.coinDetails?.market_data.market_cap_change_24h}
              </span>
              <span>
                (
                {coin.coinDetails?.market_data.market_cap_change_percentage_24h}
                %)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p>Тип ордера</p>
        <p>Рыночный ордер</p>
      </div>

      <div className="flex items-center justify-between">
        <p>{orderType === "BUY" ? "Доступные средства" : "Доступное количество"}</p>
        <div>
          {orderType === "BUY" ? (
            <div className="flex items-center">
              <DollarSign />
              <span className="text-2xl font-semibold">
                {wallet.userWallet?.balance}
              </span>
            </div>
          ) : (
            <p>{asset.assetDetails?.quantity || 0}</p>
          )}
        </div>
      </div>

      <div>
        <DialogClose asChild>
          <Button
            onClick={handleBuyCrypto}
            className={`w-full py-6 ${orderType === "SELL" ? "bg-red-600 text-white" : ""}`}
            disabled={
              quantity == 0 ||
              (orderType === "SELL" && !asset.assetDetails?.quantity) ||
              (orderType === "SELL"
                ? asset.assetDetails?.quantity * coin.coinDetails?.market_data.current_price.usd < amount
                : quantity * coin.coinDetails?.market_data.current_price.usd > wallet.userWallet?.balance)
            }
          >
            {orderType === "BUY" ? "Купить" : "Продать"}
          </Button>
        </DialogClose>
        <Button
          onClick={() => setOrderType(orderType === "BUY" ? "SELL" : "BUY")}
          className="w-full mt-5 text-xl"
          variant="link"
        >
          {orderType === "BUY" ? "Или продать" : "Или купить"}
        </Button>
      </div>
    </div>
  );
};

export default TreadingForm;