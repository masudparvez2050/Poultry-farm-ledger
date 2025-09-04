import type { DeliveryRecord, NewRecordData } from '../types';

const STORAGE_KEY = 'deliveryRecords';

// =======================================================================================
// MOCK DATABASE (using localStorage)
// In a real application, you would remove this section and the functions below would
// use `fetch` to call your backend API, which would then talk to your MongoDB database.
// =======================================================================================

const getStoredRecords = (): DeliveryRecord[] => {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return [];
  }
};

const saveStoredRecords = (records: DeliveryRecord[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
};

// =======================================================================================
// API SERVICE FUNCTIONS
// These functions mimic what you'd have if you were calling a real backend API.
// =======================================================================================


/**
 * Fetches all records from the database.
 * @returns A promise that resolves to an array of delivery records.
 */
export const getRecords = async (): Promise<DeliveryRecord[]> => {
  console.log("API: Fetching records...");
  // Simulate network delay to mimic a real API call
  await new Promise(res => setTimeout(res, 300));
  const records = getStoredRecords();
  // In a real app, sorting would ideally be done on the backend/database query
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Adds a new record to the database.
 * @param newRecordData The data for the new record.
 * @returns A promise that resolves to the newly created record.
 */
export const addRecord = async (newRecordData: NewRecordData): Promise<DeliveryRecord> => {
    console.log("API: Adding new record...", newRecordData);
    await new Promise(res => setTimeout(res, 300));

    // Calculation logic is now centralized here, could also be on the backend
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

    const records = getStoredRecords();
    saveStoredRecords([newRecord, ...records]);
    return newRecord;
};

/**
 * Updates an existing record in the database.
 * @param updatedRecordData The full record object with updated data.
 * @returns A promise that resolves to the updated record.
 */
export const updateRecord = async (updatedRecordData: DeliveryRecord): Promise<DeliveryRecord> => {
    console.log("API: Updating record...", updatedRecordData);
    await new Promise(res => setTimeout(res, 300));
    
    // Recalculate all derived fields upon update
    const entryCount = updatedRecordData.weights.length;
    const grossWeight = updatedRecordData.weights.reduce((sum, w) => sum + w, 0);
    const totalBuckleWeight = (updatedRecordData.buckleNumber || 0) * (updatedRecordData.buckleWeight || 0);
    const netWeight = grossWeight - totalBuckleWeight;
    const averageWeight = entryCount > 0 ? netWeight / entryCount : 0;
    
    const finalRecord: DeliveryRecord = {
        ...updatedRecordData,
        entryCount,
        grossWeight,
        totalBuckleWeight,
        netWeight,
        averageWeight,
    };

    let records = getStoredRecords();
    records = records.map(r => r.id === finalRecord.id ? finalRecord : r);
    saveStoredRecords(records);
    return finalRecord;
};

/**
 * Deletes a record from the database.
 * @param id The ID of the record to delete.
 * @returns A promise that resolves when the operation is complete.
 */
export const deleteRecord = async (id: string): Promise<void> => {
    console.log(`API: Deleting record ${id}...`);
    await new Promise(res => setTimeout(res, 300));
    let records = getStoredRecords();
    records = records.filter(record => record.id !== id);
    saveStoredRecords(records);
};