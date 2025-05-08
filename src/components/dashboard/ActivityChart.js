'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ActivityChart({ data, title }) {
  if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">
          No activity data available yet. Complete more todos to see your activity over time.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        ...data.datasets[0],
        fill: true,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        display: data.datasets[0].label ? true : false,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return new Date(context[0].label).toLocaleDateString();
          }
        }
      }
    }
  };

  return (
    <div className="card">
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}