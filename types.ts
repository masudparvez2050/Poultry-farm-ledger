export type NewRecordData = Omit<DeliveryRecord, 'id' | 'grossWeight' | 'totalBuckleWeight' | 'netWeight' | 'averageWeight' | 'entryCount'>;

export interface DeliveryRecord {
  id: string;
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
