import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AddRecordModal } from './components/AddRecordModal';
import { PlusIcon, Spinner } from './components/Icons';
import * as apiService from './services/apiService';
import type { DeliveryRecord, NewRecordData } from './types';

const App: React.FC = () => {
  const [records, setRecords] = useState<DeliveryRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DeliveryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
        const fetchedRecords = await apiService.getRecords();
        setRecords(fetchedRecords);
    } catch (error) {
        console.error("Failed to fetch records:", error);
        // You could set an error state here to show a message in the UI
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);


  const addRecord = useCallback(async (newRecordData: NewRecordData) => {
    await apiService.addRecord(newRecordData);
    setIsModalOpen(false);
    await fetchRecords(); // Refetch to get the latest data, including the new record
  }, [fetchRecords]);

  const updateRecord = useCallback(async (updatedRecord: DeliveryRecord) => {
    await apiService.updateRecord(updatedRecord);
    setEditingRecord(null);
    setIsModalOpen(false);
    await fetchRecords(); // Refetch to reflect the update
  }, [fetchRecords]);


  const deleteRecord = useCallback(async (id: string) => {
    await apiService.deleteRecord(id);
    await fetchRecords(); // Refetch to remove the deleted record from UI
  }, [fetchRecords]);
  
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header onAddRecord={handleOpenAddModal} />
      <main className="p-4 sm:p-6 md:p-8">
        {isLoading && records.length === 0 ? (
            <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
                <span className="ml-4 text-gray-600">Loading records...</span>
            </div>
        ) : (
            <Dashboard records={records} deleteRecord={deleteRecord} editRecord={handleOpenEditModal} />
        )}
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