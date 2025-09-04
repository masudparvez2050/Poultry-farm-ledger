import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DeliveryRecord } from "../types";
import { RecordCard } from "./RecordCard";

interface DashboardProps {
  records: DeliveryRecord[];
  deleteRecord: (id: string) => void;
  editRecord: (record: DeliveryRecord) => void;
}

const StatCard: React.FC<{ title: string; value: string }> = ({
  title,
  value,
}) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({
  records,
  deleteRecord,
  editRecord,
}) => {
  const { totalWeight, averageWeight, recordCount, trucks } = useMemo(() => {
    const totalNetWeight = records.reduce((sum, r) => sum + r.netWeight, 0);
    const recordCount = records.length;
    const totalEntries = records.reduce((sum, r) => sum + r.entryCount, 0);
    const overallAverageWeight =
      totalEntries > 0 ? totalNetWeight / totalEntries : 0;
    const trucks = new Set(records.map((r) => r.truckId)).size;
    return {
      totalWeight: totalNetWeight,
      averageWeight: overallAverageWeight,
      recordCount,
      trucks,
    };
  }, [records]);

  const chartData = useMemo(() => {
    const data = records
      .map((r) => ({
        name: `${new Date(r.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} (${r.truckId})`,
        "Net Weight (kg)": r.netWeight,
      }))
      .reverse(); // show most recent first
    return data.slice(0, 15); // Show last 15 entries
  }, [records]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Deliveries"
          value={recordCount.toLocaleString()}
        />
        <StatCard
          title="Total Net Weight (kg)"
          value={totalWeight.toFixed(2).toLocaleString()}
        />
        <StatCard
          title="Overall Avg. Weight (kg)"
          value={averageWeight.toFixed(2)}
        />
        <StatCard title="Unique Trucks" value={trucks.toString()} />
      </div>

      {records.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Deliveries Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Net Weight (kg)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Delivery History
        </h2>
        {records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <RecordCard
                key={record._id || record.id || Math.random()}
                record={record}
                onDelete={deleteRecord}
                onEdit={editRecord}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-700">
              No records found.
            </h3>
            <p className="mt-2 text-gray-500">
              Click the '+' button to add your first delivery record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
