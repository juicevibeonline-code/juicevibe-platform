import { Controller, Get, Patch, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";

@ApiTags("Settings")
@Controller("settings")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "manager")
@ApiBearerAuth()
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: "Get business settings" })
  async getSettings() {
    const settings = await this.settingsService.getSettings();
    return ApiResponseDto.ok(settings);
  }

  @Patch()
  @ApiOperation({ summary: "Update business settings" })
  async updateSettings(@Body() body: Record<string, string>) {
    const updated = await this.settingsService.updateSettings(body);
    return ApiResponseDto.ok(updated, "Settings updated successfully");
  }
}
