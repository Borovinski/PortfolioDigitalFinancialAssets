import {
  depositMoney,
  getUserWallet,
  getWalletTransactions,
} from "@/Redux/Wallet/Action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  DownloadIcon,
  ReloadIcon,
  ShuffleIcon,
  UpdateIcon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { DollarSign, WalletIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";
import { getPaymentDetails } from "@/Redux/Withdrawal/Action";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet } = useSelector((store) => store);
  const query = useQuery();

  // Только нужные параметры, razorpayPaymentId можно убрать если не используешь
  const paymentId = query.get("payment_id");
  const orderId = query.get("order_id");
  const { order_id } = useParams();

  // Контроль повторного запроса
  const depositRequested = useRef(false);

  useEffect(() => {
    // Теперь запрос отправится только один раз!
    if ((orderId || order_id) && !depositRequested.current) {
      depositRequested.current = true;
      dispatch(
        depositMoney({
          jwt: localStorage.getItem("jwt"),
          orderId: orderId || order_id,
          paymentId: paymentId || "AuedkfeuUe",
          navigate,
        })
      ).then(() => {
        // После успешного пополнения убирай параметры из URL
        navigate("/wallet", { replace: true });
      });
    }
  }, [paymentId, orderId, order_id, dispatch, navigate]);

  useEffect(() => {
    handleFetchUserWallet();
    hanldeFetchWalletTransactions();
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
    // eslint-disable-next-line
  }, []);

  const handleFetchUserWallet = () => {
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  };

  const hanldeFetchWalletTransactions = () => {
    dispatch(getWalletTransactions({ jwt: localStorage.getItem("jwt") }));
  };

  function copyToClipboard(text) {
    const element = document.createElement("textarea");
    element.value = text;
    document.body.appendChild(element);
    element.select();
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Не удалось скопировать текст", err);
    }
    document.body.removeChild(element);
  }

  if (wallet.loading) return <SpinnerBackdrop />;

  return (
    <div className="flex flex-col items-center">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="pb-9">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <WalletIcon className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl">Мой кошелёк</CardTitle>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-200 text-sm">
                      #FAVHJY{wallet.userWallet?.id}
                    </p>
                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="cursor-pointer hover:text-slate-300"
                    />
                  </div>
                </div>
              </div>
              <ReloadIcon
                onClick={handleFetchUserWallet}
                className="w-6 h-6 cursor-pointer hover:text-gray-400"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign />
              <span className="text-2xl font-semibold">
                {wallet.userWallet?.balance} $
              </span>
            </div>

            <div className="flex gap-7 mt-5">
              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md">
                    <UploadIcon />
                    <span className="text-sm mt-2">Пополнить</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10">
                  <DialogHeader>
                    <DialogTitle className="text-center text-2xl">
                      Пополните кошелёк
                    </DialogTitle>
                    <TopupForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md">
                    <DownloadIcon />
                    <span className="text-sm mt-2">Вывести</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Запросить вывод средств
                    </DialogTitle>
                    <WithdrawForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger>
                  <div className="h-24 w-24 hover:text-gray-400 cursor-pointer flex flex-col items-center justify-center rounded-md shadow-md">
                    <ShuffleIcon />
                    <span className="text-sm mt-2">Перевод</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-10">
                  <DialogHeader>
                    <DialogTitle className="text-center text-xl">
                      Перевести другому пользователю
                    </DialogTitle>
                    <TransferForm />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="py-5 pt-10">
          <div className="flex gap-2 items-center pb-5">
            <h1 className="text-2xl font-semibold">История</h1>
            <UpdateIcon
              onClick={hanldeFetchWalletTransactions}
              className="p-0 h-7 w-7 cursor-pointer hover:text-gray-400"
            />
          </div>

          <div className="space-y-5">
            {wallet.transactions?.map((item, index) => (
              <div key={index}>
                <Card className="px-5 py-2 flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <Avatar>
                      <AvatarFallback>
                        <ShuffleIcon />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h1>{item.type || item.purpose}</h1>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="flex items-center">
                      <span className={`${item.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                        {item.amount} USD
                      </span>
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
