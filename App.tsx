import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AddRecordModal } from './components/AddRecordModal';
import { PlusIcon } from './components/Icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { DeliveryRecord, NewRecordData } from './types';

const App: React.FC = () => {
  const [records, setRecords] = useLocalStorage<DeliveryRecord[]>('deliveryRecords', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DeliveryRecord | null>(null);

  const addRecord = useCallback((newRecordData: NewRecordData) => {
    const entryCount = newRecordData.weights.length;
    const grossWeight = newRecordData.weights.reduce((sum, w) => sum + w, 0);
    const totalBuckleWeight = (newRecordData.buckleNumber || 0) * (newRecordData.buckleWeight || 0);
    const netWeight = grossWeight - totalBuckleWeight;
    const averageWeight = entryCount > 0 ? netWeight / entryCount : 0;

    const newRecord: DeliveryRecord = {
      id: `rec-${Date.now()}`,
      ...newRecordData,
      entryCount,
      grossWeight,
      totalBuckleWeight,
      netWeight,
      averageWeight,
    };

    setRecords(prevRecords => [newRecord, ...prevRecords]);
    setIsModalOpen(false);
  }, [setRecords]);

  const updateRecord = useCallback((updatedRecord: DeliveryRecord) => {
    const entryCount = updatedRecord.weights.length;
    const grossWeight = updatedRecord.weights.reduce((sum, w) => sum + w, 0);
    const totalBuckleWeight = (updatedRecord.buckleNumber || 0) * (updatedRecord.buckleWeight || 0);
    const netWeight = grossWeight - totalBuckleWeight;
    const averageWeight = entryCount > 0 ? netWeight / entryCount : 0;
    
    const finalRecord: DeliveryRecord = {
        ...updatedRecord,
        entryCount,
        grossWeight,
        totalBuckleWeight,
        netWeight,
        averageWeight,
    };

    setRecords(prevRecords => prevRecords.map(r => r.id === finalRecord.id ? finalRecord : r));
    setEditingRecord(null);
    setIsModalOpen(false);
  }, [setRecords]);


  const deleteRecord = useCallback((id: string) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
  }, [setRecords]);
  
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (record: DeliveryRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header onAddRecord={handleOpenAddModal} />
      <main className="p-4 sm:p-6 md:p-8">
        <Dashboard records={sortedRecords} deleteRecord={deleteRecord} editRecord={handleOpenEditModal} />
      </main>
      {isModalOpen && (
        <AddRecordModal
          onClose={handleCloseModal}
          onAddRecord={addRecord}
          onUpdateRecord={updateRecord}
          recordToEdit={editingRecord}
        />
      )}
      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110"
        aria-label="Add new record"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default App;
