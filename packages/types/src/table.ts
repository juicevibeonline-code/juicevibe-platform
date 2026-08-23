export interface Table {
  id: string;
  number: number;
  capacity?: number;
  status?: import("./common").TableState;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableInput {
  number: number;
}
