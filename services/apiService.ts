import type { DeliveryRecord, NewRecordData } from '../types';

// =======================================================================================
// API CONFIGURATION
// =======================================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Generic API request handler
const apiRequest = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// =======================================================================================
// API SERVICE FUNCTIONS
// These functions now call the actual backend API instead of using localStorage.
// =======================================================================================


/**
 * Fetches all records from the database.
 * @returns A promise that resolves to an array of delivery records.
 */
export const getRecords = async (): Promise<DeliveryRecord[]> => {
  console.log("API: Fetching records...");
  
  try {
    const response = await apiRequest('/records?sortBy=createdAt&sortOrder=desc');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch records:', error);
    throw new Error('Failed to fetch records. Please try again.');
  }
};

/**
 * Adds a new record to the database.
 * @param newRecordData The data for the new record.
 * @returns A promise that resolves to the newly created record.
 */
export const addRecord = async (newRecordData: NewRecordData): Promise<DeliveryRecord> => {
  console.log("API: Adding new record...", newRecordData);
  
  try {
    const response = await apiRequest('/records', {
      method: 'POST',
      body: JSON.stringify(newRecordData),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add record:', error);
    throw new Error('Failed to add record. Please try again.');
  }
};

/**
 * Updates an existing record in the database.
 * @param updatedRecordData The full record object with updated data.
 * @returns A promise that resolves to the updated record.
 */
export const updateRecord = async (updatedRecordData: DeliveryRecord): Promise<DeliveryRecord> => {
  console.log("API: Updating record...", updatedRecordData);
  
  try {
    const response = await apiRequest(`/records/${updatedRecordData.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedRecordData),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update record:', error);
    throw new Error('Failed to update record. Please try again.');
  }
};

/**
 * Deletes a record from the database.
 * @param id The ID of the record to delete.
 * @returns A promise that resolves when the operation is complete.
 */
export const deleteRecord = async (id: string): Promise<void> => {
  console.log(`API: Deleting record ${id}...`);
  
  try {
    await apiRequest(`/records/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete record:', error);
    throw new Error('Failed to delete record. Please try again.');
  }
};

/**
 * Fetches statistics about the records.
 * @returns A promise that resolves to statistics data.
 */
export const getRecordsStats = async () => {
  console.log("API: Fetching records statistics...");
  
  try {
    const response = await apiRequest('/records/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    throw new Error('Failed to fetch statistics. Please try again.');
  }
};