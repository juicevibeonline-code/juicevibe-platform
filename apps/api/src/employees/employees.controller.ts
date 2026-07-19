import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Employees")
@Controller("employees")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "manager")
@ApiBearerAuth()
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: "Get all staff employees (Admin/Manager)" })
  async getEmployees() {
    const employees = await this.employeesService.getEmployees();
    return ApiResponseDto.ok(employees);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get employee details by ID (Admin/Manager)" })
  async getEmployee(@Param("id") id: string) {
    const employee = await this.employeesService.getEmployee(id);
    return ApiResponseDto.ok(employee);
  }

  @Post()
  @ApiOperation({ summary: "Create a new employee and system user account (Admin/Manager)" })
  async createEmployee(@Body() body: CreateEmployeeDto) {
    const employee = await this.employeesService.createEmployee(body);
    return ApiResponseDto.ok(employee, "Employee created successfully");
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update employee details (Admin/Manager)" })
  async updateEmployee(@Param("id") id: string, @Body() body: UpdateEmployeeDto) {
    const employee = await this.employeesService.updateEmployee(id, body);
    return ApiResponseDto.ok(employee, "Employee updated successfully");
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deactivate employee (Admin/Manager)" })
  async deleteEmployee(@Param("id") id: string) {
    await this.employeesService.deleteEmployee(id);
    return ApiResponseDto.ok(null, "Employee deactivated successfully");
  }
}
