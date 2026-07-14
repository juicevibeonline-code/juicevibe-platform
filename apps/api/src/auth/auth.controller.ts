import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, Patch } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CurrentUser } from "../common/decorators";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";
import { RegisterDto, LoginDto, RefreshDto } from "../common/dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return ApiResponseDto.ok(result, "Registration successful");
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return ApiResponseDto.ok(result, "Login successful");
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  async refresh(@Body() dto: RefreshDto) {
    const tokens = await this.authService.refresh(dto.refreshToken);
    return ApiResponseDto.ok(tokens);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  async getMe(@CurrentUser("sub") userId: string) {
    const user = await this.authService.getMe(userId);
    return ApiResponseDto.ok(user);
  }

  @Get("test-prisma")
  testPrisma() {
    const db = require("@juice-vibe/database");
    return {
      dbKeys: Object.keys(db),
      dbType: typeof db,
      prismaType: typeof db.prisma,
      prismaObject: db.prisma ? "defined" : "undefined",
    };
  }

  @Get("customers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all customers" })
  async getCustomers() {
    const customers = await this.authService.getCustomers();
    return ApiResponseDto.ok(customers);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  async logout(@CurrentUser("sub") userId: string) {
    await this.authService.logout(userId);
    return ApiResponseDto.ok(null, "Logged out successfully");
  }

  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change user password" })
  async changePassword(@CurrentUser("sub") userId: string, @Body() body: any) {
    await this.authService.changePassword(userId, body.oldPassword, body.newPassword);
    return ApiResponseDto.ok(null, "Password changed successfully");
  }
}

