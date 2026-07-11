import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
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
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
