import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { MenuModule } from "./menu/menu.module";
import { OrdersModule } from "./orders/orders.module";
import { GalleryModule } from "./gallery/gallery.module";
import { ContactModule } from "./contact/contact.module";
import { TestimonialsModule } from "./testimonials/testimonials.module";
import { BlogModule } from "./blog/blog.module";
import { CouponModule } from "./coupon/coupon.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { SettingsModule } from "./settings/settings.module";
import { TableModule } from "./table/table.module";
import { InventoryModule } from "./inventory/inventory.module";
import { EmployeesModule } from "./employees/employees.module";
import { PosModule } from "./pos/pos.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AuthModule,
    MenuModule,
    OrdersModule,
    GalleryModule,
    ContactModule,
    TestimonialsModule,
    BlogModule,
    CouponModule,
    AnalyticsModule,
    SettingsModule,
    TableModule,
    InventoryModule,
    EmployeesModule,
    PosModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

