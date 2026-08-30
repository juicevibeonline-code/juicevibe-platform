import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Settings")
@Controller("settings")
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get("public")
  @ApiOperation({ summary: "Get public business and storefront settings" })
  async getPublicSettings() {
    const settings = await this.settingsService.getPublicSettings();
    return ApiResponseDto.ok(settings);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get business settings (Admin)" })
  async getSettings() {
    const settings = await this.settingsService.getSettings();
    return ApiResponseDto.ok(settings);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update business settings (Admin)" })
  async updateSettings(@Body() body: Record<string, string>) {
    const updated = await this.settingsService.updateSettings(body);
    return ApiResponseDto.ok(updated, "Settings updated successfully");
  }
}
