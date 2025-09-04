import React, { useState } from 'react';
import type { DeliveryRecord } from '../types';
import { TrashIcon, ChevronDownIcon, PencilIcon } from './Icons';

interface RecordCardProps {
  record: DeliveryRecord;
  onDelete: (id: string) => void;
  onEdit: (record: DeliveryRecord) => void;
}

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
);

export const RecordCard: React.FC<RecordCardProps> = ({ record, onDelete, onEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this record?')) {
            onDelete(record.id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(record);
    };

    const formattedDate = new Date(record.date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300">
      <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs font-bold">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-bold">{new Date(record.date).getDate()}</span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-600 truncate">Truck ID: {record.truckId}</p>
              <p className="text-sm text-gray-500 truncate">Invoice: {record.invoiceNo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
                <p className="font-semibold text-gray-900">{record.netWeight.toFixed(2)} kg</p>
                <p className="text-sm text-gray-500">{record.entryCount} entries</p>
            </div>
            <button onClick={handleEdit} aria-label="Edit record" className="text-gray-400 hover:text-blue-500 p-2 rounded-full transition-colors">
              <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={handleDelete} aria-label="Delete record" className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors">
              <TrashIcon className="w-5 h-5" />
            </button>
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 animate-fade-in-down">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
                <DetailItem label="Date" value={formattedDate} />
                <DetailItem label="Truck ID" value={record.truckId} />
                <DetailItem label="Invoice No." value={record.invoiceNo} />
                <DetailItem label="Total Entries" value={record.entryCount} />
                <DetailItem label="Gross Weight" value={`${record.grossWeight.toFixed(2)} kg`} />
                <DetailItem label="Buckle Deduction" value={`${record.totalBuckleWeight.toFixed(2)} kg (${record.buckleNumber} @ ${record.buckleWeight}kg)`} />
                <DetailItem label="Net Weight" value={`${record.netWeight.toFixed(2)} kg`} />
                <DetailItem label="Average Weight" value={`${record.averageWeight.toFixed(2)} kg`} />
            </dl>
            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Individual Weights (kg):</h4>
                <div className="max-h-40 overflow-y-auto bg-white p-3 rounded-md border text-sm">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {record.weights.map((weight, index) => (
                            <span key={index} className="text-gray-700 p-1 text-center rounded bg-gray-100">{weight}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
