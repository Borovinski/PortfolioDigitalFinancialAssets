import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF0",
  "#FF6699", "#33CCFF", "#FF4444", "#AA66CC", "#0099CC"
];

const PortfolioDiversification = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDiversification = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get("/api/portfolio/diversification", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Ошибка при получении диверсификации:", error);
      }
    };

    fetchDiversification();
  }, []);

  return (
    <div className="pt-4 px-6 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-1">
        🔍 Анализ диверсификации крипто-портфеля
      </h1>

      <p className="text-gray-400 text-sm max-w-3xl leading-relaxed text-center mx-auto mb-6">
        <strong>Диверсификация</strong> показывает, как распределены ваши активы по криптовалютам. 
        Это помогает снизить риски и понять, насколько сбалансирован ваш портфель. 
        Ниже представлена диаграмма с процентным соотношением каждой монеты, а справа — расширенная информация.
      </p>

      {data.length === 0 ? (
        <p className="text-center text-gray-400">Нет данных для отображения</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* 📊 График — 65% ширины и 500px высота */}
          <div className="w-full lg:w-[65%] h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="percentage"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  outerRadius={160}
                  innerRadius={70}
                  label={({ symbol, percentage }) =>
                    `${symbol}: ${percentage.toFixed(1)}%`
                  }
                  labelLine={false}
                  isAnimationActive={true}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) =>
                    [`${value.toFixed(2)}%`, props.payload.symbol]
                  }
                />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ℹ️ Информация по активам */}
          <div className="w-full lg:w-[35%]">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Информация по активам:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.map((item, index) => (
                <div key={index} className="bg-zinc-800 p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between font-medium text-white mb-1">
                    <span>{item.symbol}</span>
                    <span>{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div>
                    Текущая стоимость:{" "}
                    <strong>${item.currentValue.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioDiversification;
