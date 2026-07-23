import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "Juice Vibe API",
      timestamp: new Date().toISOString(),
    };
  }

  @Get("health")
  getHealthCheck() {
    return {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
