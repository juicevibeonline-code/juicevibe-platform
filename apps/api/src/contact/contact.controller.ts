import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ContactService } from "./contact.service";
import { JwtAuthGuard, RolesGuard, Roles } from "../common/guards";
import { ApiResponseDto } from "../common/dto";
import { CreateContactMessageDto, SubscribeDto } from "../common/dto";

@ApiTags("Contact")
@Controller("contact")
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: "Submit contact form message" })
  async submitMessage(@Body() body: CreateContactMessageDto) {
    await this.contactService.submitMessage(body);
    return ApiResponseDto.ok(null, "Message sent successfully");
  }

  @Post("subscribe")
  @ApiOperation({ summary: "Subscribe to newsletter" })
  async subscribe(@Body() body: SubscribeDto) {
    await this.contactService.subscribe(body.email);
    return ApiResponseDto.ok(null, "Subscribed successfully");
  }

  @Get("messages")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get contact messages" })
  async getMessages(
    @Query("isRead") isRead?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const result = await this.contactService.getMessages({
      isRead: isRead !== undefined ? isRead === "true" : undefined,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    return ApiResponseDto.paginated(result.messages, result.total, result.page, result.limit);
  }

  @Patch("messages/:id/read")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mark message as read" })
  async markAsRead(@Param("id") id: string) {
    await this.contactService.markAsRead(id);
    return ApiResponseDto.ok(null, "Message marked as read");
  }

  @Delete("messages/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a message" })
  async deleteMessage(@Param("id") id: string) {
    await this.contactService.deleteMessage(id);
    return ApiResponseDto.ok(null, "Message deleted");
  }

  @Get("subscribers")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get newsletter subscribers (Admin/Manager)" })
  async getSubscribers(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    const result = await this.contactService.getSubscribers({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    return ApiResponseDto.paginated(result.subscribers, result.total, result.page, result.limit);
  }

  @Patch("subscribers/:id/toggle")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle subscriber active/inactive status" })
  async toggleSubscriber(@Param("id") id: string) {
    const sub = await this.contactService.toggleSubscriber(id);
    return ApiResponseDto.ok(sub, "Subscriber status updated");
  }

  @Delete("subscribers/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "manager")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete / remove a newsletter subscriber" })
  async deleteSubscriber(@Param("id") id: string) {
    await this.contactService.deleteSubscriber(id);
    return ApiResponseDto.ok(null, "Subscriber removed successfully");
  }
}

