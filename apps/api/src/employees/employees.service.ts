import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { prisma } from "@juice-vibe/database";
import * as bcrypt from "bcryptjs";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";

@Injectable()
export class EmployeesService {
  async getEmployees() {
    return prisma.employee.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: { employeeId: "asc" },
    });
  }

  async getEmployee(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
    if (!employee || !employee.isActive) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async createEmployee(input: CreateEmployeeDto) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      throw new ConflictException(`Email ${input.email} is already registered`);
    }

    // Check if employeeId already exists
    const existingEmployee = await prisma.employee.findUnique({ where: { employeeId: input.employeeId } });
    if (existingEmployee) {
      throw new ConflictException(`Employee ID ${input.employeeId} already exists`);
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          emailVerified: true,
        },
      });

      return tx.employee.create({
        data: {
          userId: user.id,
          employeeId: input.employeeId,
          position: input.position,
          salary: input.salary || null,
          hireDate: input.hireDate ? new Date(input.hireDate) : new Date(),
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      });
    });
  }

  async updateEmployee(id: string, input: UpdateEmployeeDto) {
    const employee = await this.getEmployee(id);

    return prisma.$transaction(async (tx) => {
      // Update User fields
      const userUpdate: any = {};
      if (input.name !== undefined) userUpdate.name = input.name;
      if (input.email !== undefined) userUpdate.email = input.email;
      if (input.role !== undefined) userUpdate.role = input.role;
      if (input.password !== undefined) {
        userUpdate.password = await bcrypt.hash(input.password, 12);
      }

      if (Object.keys(userUpdate).length > 0) {
        await tx.user.update({
          where: { id: employee.userId },
          data: userUpdate,
        });
      }

      // Update Employee fields
      const employeeUpdate: any = {};
      if (input.position !== undefined) employeeUpdate.position = input.position;
      if (input.salary !== undefined) employeeUpdate.salary = input.salary;
      if (input.hireDate !== undefined) {
        employeeUpdate.hireDate = input.hireDate ? new Date(input.hireDate) : null;
      }

      return tx.employee.update({
        where: { id },
        data: employeeUpdate,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      });
    });
  }

  async deleteEmployee(id: string) {
    const employee = await this.getEmployee(id);

    return prisma.$transaction(async (tx) => {
      await tx.employee.update({
        where: { id },
        data: { isActive: false },
      });

      await tx.user.update({
        where: { id: employee.userId },
        data: { isActive: false },
      });
    });
  }
}
