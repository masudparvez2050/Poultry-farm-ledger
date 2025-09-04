import type { DeliveryRecord, NewRecordData } from '../types';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to add delay for better UX (simulate network delay)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches all records from the MongoDB database.
 * @returns A promise that resolves to an array of delivery records.
 */
export const getRecords = async (): Promise<DeliveryRecord[]> => {
  console.log("API: Fetching records from MongoDB...");
  await delay(300); // Simulate network delay
  
  try {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching records:', error);
    throw error;
  }
};

/**
 * Adds a new record to the MongoDB database.
 * @param newRecordData The data for the new record.
 * @returns A promise that resolves to the newly created record.
 */
export const addRecord = async (newRecordData: NewRecordData): Promise<DeliveryRecord> => {
  console.log("API: Adding new record to MongoDB...", newRecordData);
  await delay(300); // Simulate network delay

  try {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecordData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating record:', error);
    throw error;
  }
};

/**
 * Updates an existing record in the MongoDB database.
 * @param updatedRecordData The full record object with updated data.
 * @returns A promise that resolves to the updated record.
 */
export const updateRecord = async (updatedRecordData: DeliveryRecord): Promise<DeliveryRecord> => {
  console.log("API: Updating record in MongoDB...", updatedRecordData);
  await delay(300); // Simulate network delay
  
  try {
    const response = await fetch(`${API_BASE_URL}/records/${updatedRecordData._id || updatedRecordData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: updatedRecordData.date,
        truckId: updatedRecordData.truckId,
        invoiceNo: updatedRecordData.invoiceNo,
        weights: updatedRecordData.weights,
        buckleNumber: updatedRecordData.buckleNumber,
        buckleWeight: updatedRecordData.buckleWeight,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating record:', error);
    throw error;
  }
};

/**
 * Deletes a record from the MongoDB database.
 * @param id The ID of the record to delete.
 * @returns A promise that resolves when the operation is complete.
 */
export const deleteRecord = async (id: string): Promise<void> => {
  console.log(`API: Deleting record ${id} from MongoDB...`);
  await delay(300); // Simulate network delay
  
  try {
    const response = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting record:', error);
    throw error;
  }
};