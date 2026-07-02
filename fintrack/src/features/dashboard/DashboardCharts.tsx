"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCentsToBRL } from "@/features/transactions/transactionRules";

type ExpenseCategoryChartItem = {
  categoryName: string;
  amountCents: number;
  color: string;
};

type IncomeVsExpenseChartItem = {
  name: string;
  amountCents: number;
};

type DashboardChartsProps = {
  expensesByCategory: ExpenseCategoryChartItem[];
  incomeVsExpense: IncomeVsExpenseChartItem[];
};

type MoneyTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: {
      name?: string;
      categoryName?: string;
    };
  }>;
};

function MoneyTooltip({ active, payload }: MoneyTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const label = item.payload?.categoryName ?? item.payload?.name ?? item.name;
  const value = typeof item.value === "number" ? item.value : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-slate-700">{label}</p>
      <p className="font-bold text-slate-950">{formatCentsToBRL(value)}</p>
    </div>
  );
}

function formatYAxisCurrency(value: number) {
  const amountInReais = value / 100;

  if (amountInReais >= 1000) {
    return `${new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: amountInReais >= 10000 ? 0 : 1,
    }).format(amountInReais / 1000)} mil`;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(amountInReais);
}

export function DashboardCharts({
  expensesByCategory,
  incomeVsExpense,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">
          Despesas por categoria
        </h2>
        {expensesByCategory.length > 0 ? (
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="amountCents"
                  nameKey="categoryName"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {expensesByCategory.map((entry) => (
                    <Cell key={entry.categoryName} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<MoneyTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Nenhuma despesa encontrada no período.
          </p>
        )}
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">
          Receitas vs despesas
        </h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={incomeVsExpense}
              margin={{ top: 8, right: 8, bottom: 0, left: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                width={72}
                tickMargin={8}
                tickFormatter={(value) => formatYAxisCurrency(Number(value))}
              />
              <Tooltip content={<MoneyTooltip />} />
              <Bar dataKey="amountCents" radius={[12, 12, 0, 0]}>
                <Cell fill="#047857" />
                <Cell fill="#dc2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </div>
  );
}
