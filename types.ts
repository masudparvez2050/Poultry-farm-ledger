export type NewRecordData = Omit<DeliveryRecord, 'id' | '_id' | 'grossWeight' | 'totalBuckleWeight' | 'netWeight' | 'averageWeight' | 'entryCount'>;

export interface DeliveryRecord {
  id?: string; // Made optional for backward compatibility
  _id?: string; // MongoDB ObjectId
  date: string;
  truckId: string;
  invoiceNo: string;
  weights: number[];
  buckleNumber: number;
  buckleWeight: number;
  
  // Calculated fields
  grossWeight: number;
  totalBuckleWeight: number;
  netWeight: number;
  averageWeight: number;
  entryCount: number;
}
