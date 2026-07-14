export interface Employee {
  id: string;
  userId: string;
  employeeId: string;
  position: string;
  salary?: number;
  hireDate: string;
  isActive: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export interface CreateEmployeeInput {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  role: string;
  position: string;
  salary?: number;
  hireDate?: string;
}

export interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  position?: string;
  salary?: number;
  hireDate?: string;
}
