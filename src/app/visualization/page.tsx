'use client';

import { useApp } from '@/context/AppContext';
import { LoadingSpinner, TransactionItem } from '@/components';
import { SectionType, SECTION_LABELS, SECTION_ICONS } from '@/types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export default function VisualizationPage() {
  const {
    isLoading,
    getSectionTotal,
    getTotalEarned,
    getTotalSpent,
    getAvailableMoney,
    getRecentTransactions,
  } = useApp();

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];

  // Pie chart data - savings distribution
  const pieData = sections
    .map((section, index) => ({
      name: SECTION_LABELS[section],
      value: getSectionTotal(section),
      icon: SECTION_ICONS[section],
      color: COLORS[index],
    }))
    .filter((item) => item.value > 0);

  // Bar chart data - earned vs spent
  const totalEarned = getTotalEarned();
  const totalSpent = getTotalSpent();
  const barData = [
    {
      name: 'Earnings',
      amount: totalEarned,
      fill: '#10B981',
    },
    {
      name: 'Spending',
      amount: totalSpent,
      fill: '#EF4444',
    },
  ];

  // Available vs Lend data
  const availableMoney = getAvailableMoney();
  const lendAmount = getSectionTotal('lend');
  const comparisonData = [
    {
      name: 'Available',
      amount: availableMoney,
      fill: '#3B82F6',
    },
    {
      name: 'Lent Out',
      amount: lendAmount,
      fill: '#F59E0B',
    },
  ];

  const recentTransactions = getRecentTransactions(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Visualization
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Charts and insights
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💰 Savings Distribution
          </h2>
          {pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `৳${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {item.icon} {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Earned vs Spent Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Earned vs Spent
          </h2>
          {totalEarned === 0 && totalSpent === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No transactions yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tickFormatter={(value) => `৳${value.toLocaleString()}`} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  formatter={(value) => `৳${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* Summary */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Earned</p>
              <p className="text-lg font-bold text-green-600">৳{totalEarned.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
              <p className="text-lg font-bold text-red-600">৳{totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Net</p>
              <p className={`text-lg font-bold ${totalEarned - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalEarned - totalSpent >= 0 ? '+' : ''}৳{(totalEarned - totalSpent).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Available vs Lend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏦 Available vs Loans
          </h2>
          {availableMoney === 0 && lendAmount === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `৳${value.toLocaleString()}`} />
                <Tooltip
                  formatter={(value) => `৳${Number(value).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {/* Summary */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
              <p className="text-lg font-bold text-blue-600">৳{availableMoney.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Lent Out</p>
              <p className="text-lg font-bold text-amber-600">৳{lendAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📋 Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
