import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { OrdersModule } from "../orders/orders.module";
import { PosController } from "./pos.controller";
import { PosService } from "./pos.service";
import { ShiftService } from "./shift.service";

@Module({
  imports: [AuthModule, OrdersModule],
  controllers: [PosController],
  providers: [PosService, ShiftService],
  exports: [PosService, ShiftService],
})
export class PosModule {}
