import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { DeliveryRecord, NewRecordData } from '../types';
import { extractWeightsFromImage } from '../services/geminiService';
import { Spinner } from './Spinner';
import { UploadIcon, XMarkIcon } from './Icons';

interface AddRecordModalProps {
  onClose: () => void;
  onAddRecord: (record: NewRecordData) => void;
  onUpdateRecord: (record: DeliveryRecord) => void;
  recordToEdit?: DeliveryRecord | null;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({ onClose, onAddRecord, onUpdateRecord, recordToEdit }) => {
  const isEditMode = !!recordToEdit;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [truckId, setTruckId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [weightsStr, setWeightsStr] = useState('');
  const [buckleNumber, setBuckleNumber] = useState('');
  const [buckleWeight, setBuckleWeight] = useState('');


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && recordToEdit) {
      setDate(recordToEdit.date);
      setTruckId(recordToEdit.truckId);
      setInvoiceNo(recordToEdit.invoiceNo);
      setWeightsStr(recordToEdit.weights.join(' '));
      setBuckleNumber(String(recordToEdit.buckleNumber || ''));
      setBuckleWeight(String(recordToEdit.buckleWeight || ''));
    }
  }, [isEditMode, recordToEdit]);


  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const weights = await extractWeightsFromImage(file);
      setWeightsStr(weights.join(' '));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !truckId || !invoiceNo || !weightsStr) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Process weights: split, convert to number, filter invalid, then apply business logic.
    const weights = weightsStr.split(/[\s,]+/)
        .map(w => parseFloat(w)) // Use parseFloat to handle existing decimals
        .filter(n => !isNaN(n) && n > 0)
        .map(n => (Number.isInteger(n) && n >= 100) ? n / 10 : n); // Convert e.g. 567 -> 56.7

    if (weights.length === 0) {
        alert('Please enter valid weights.');
        return;
    }
    
    const bn = parseInt(buckleNumber, 10) || 0;
    const bw = parseFloat(buckleWeight) || 0;

    if (isEditMode && recordToEdit) {
      onUpdateRecord({ ...recordToEdit, date, truckId, invoiceNo, weights, buckleNumber: bn, buckleWeight: bw });
    } else {
      onAddRecord({ date, truckId, invoiceNo, weights, buckleNumber: bn, buckleWeight: bw });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Delivery Record' : 'Add New Delivery Record'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="truckId" className="block text-sm font-medium text-gray-700">Truck ID</label>
                        <input type="text" id="truckId" value={truckId} onChange={(e) => setTruckId(e.target.value)} required placeholder="e.g., GK-114" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="invoiceNo" className="block text-sm font-medium text-gray-700">Invoice No.</label>
                    <input type="text" id="invoiceNo" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required placeholder="e.g., 151775" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="buckleNumber" className="block text-sm font-medium text-gray-700">Buckle Number</label>
                        <input type="number" step="1" min="0" id="buckleNumber" value={buckleNumber} onChange={(e) => setBuckleNumber(e.target.value)} placeholder="e.g., 5" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label htmlFor="buckleWeight" className="block text-sm font-medium text-gray-700">Buckle Weight (kg)</label>
                        <input type="number" step="0.1" min="0" id="buckleWeight" value={buckleWeight} onChange={(e) => setBuckleWeight(e.target.value)} placeholder="e.g., 8" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Weights</label>
                    <div className="mt-2 p-2 border-2 border-dashed border-gray-300 rounded-md">
                        <div className="flex items-center justify-center space-x-4">
                           <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <UploadIcon className="w-5 h-5 mr-2" />
                                {isLoading ? 'Scanning...' : 'Scan from Image'}
                            </button>
                            {isLoading && <Spinner size="sm"/>}
                        </div>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                        {fileName && !isLoading && <p className="text-sm text-gray-500 text-center mt-2">Scanned: {fileName}</p>}
                    </div>

                    <textarea
                        id="weights"
                        rows={6}
                        value={weightsStr}
                        onChange={(e) => setWeightsStr(e.target.value)}
                        required
                        placeholder="Enter weights separated by space or comma, or scan an image."
                        className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                     <p className="mt-1 text-xs text-gray-500">Enter weights separated by spaces or commas. For values from the sheet like '567', enter them as '567'; the app will correctly convert it to 56.7 kg.</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                      {isLoading ? 'Processing...' : (isEditMode ? 'Update Record' : 'Save Record')}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};
