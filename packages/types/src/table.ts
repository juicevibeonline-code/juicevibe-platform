export interface Table {
  id: string;
  number: number;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableInput {
  number: number;
}
