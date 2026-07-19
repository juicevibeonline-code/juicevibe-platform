import { apiClient } from "./api-client";
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from "@juice-vibe/types";

export const employeeService = {
  async getEmployees(): Promise<Employee[]> {
    const { data } = await apiClient.get("/employees");
    return data.data;
  },

  async getEmployee(id: string): Promise<Employee> {
    const { data } = await apiClient.get(`/employees/${id}`);
    return data.data;
  },

  async createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    const { data } = await apiClient.post("/employees", input);
    return data.data;
  },

  async updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    const { data } = await apiClient.patch(`/employees/${id}`, input);
    return data.data;
  },

  async deleteEmployee(id: string): Promise<void> {
    await apiClient.delete(`/employees/${id}`);
  },
};
