import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const PortfolioOptimization = () => {
  const [data, setData] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get("/api/portfolio/optimize", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Ошибка при получении рекомендаций:", error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getAction = (diff) => {
    if (diff > 1) return "Увеличить";
    if (diff < -1) return "Уменьшить";
    return "Оставить";
  };

  const getIcon = (diff) => {
    if (diff > 1) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (diff < -1) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const handleRebalance = async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      await axios.post("/api/portfolio/rebalance", {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      toast({
        title: "Портфель сбалансирован",
        description: "Рекомендации применены автоматически.",
      });

      // Перезапрашиваем рекомендации
      fetchRecommendations();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить оптимизацию портфеля.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-10 px-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        ⚙️ Рекомендации по оптимизации портфеля
      </h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-400">Нет рекомендаций</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-zinc-900 rounded-xl overflow-hidden">
              <thead className="bg-zinc-800 text-gray-300 text-sm uppercase">
                <tr>
                  <th className="p-3 text-center">Актив</th>
                  <th className="p-3 text-center">Текущий %</th>
                  <th className="p-3 text-center">Целевой %</th>
                  <th className="p-3 text-center">Разница</th>
                  <th className="p-3 text-center">Рекомендация</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rec, index) => {
                  const action = getAction(rec.difference);
                  const isIncrease = rec.difference > 1;
                  const isDecrease = rec.difference < -1;

                  return (
                    <tr
                      key={index}
                      className={`border-t border-zinc-800 text-sm hover:bg-zinc-800 transition ${
                        isIncrease
                          ? "text-green-400"
                          : isDecrease
                          ? "text-red-400"
                          : "text-gray-300"
                      }`}
                    >
                      <td className="p-3 text-center font-medium uppercase">{rec.symbol}</td>
                      <td className="p-3 text-center">{rec.currentPercent.toFixed(2)}%</td>
                      <td className="p-3 text-center">{rec.targetPercent.toFixed(2)}%</td>
                      <td className="p-3 text-center">
                        {rec.difference.toFixed(2)}%
                      </td>
                      <td className="p-3 text-center flex items-center justify-center gap-2">
                        {getIcon(rec.difference)}
                        <span className="capitalize">{action}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <Button onClick={handleRebalance} className="px-6 py-2">
              🔄 Автоматически оптимизировать портфель
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioOptimization;
