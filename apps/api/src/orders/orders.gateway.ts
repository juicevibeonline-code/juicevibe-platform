import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger("OrdersGateway");

  afterInit(server: Server) {
    this.logger.log("Orders WebSocket Gateway initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitNewOrder(order: any) {
    if (this.server) {
      this.server.emit("newOrder", order);
      this.logger.log(`Emitted newOrder event for order number: ${order.orderNumber}`);
    } else {
      this.logger.warn("WebSocket server is not initialized yet. Skipping order emission.");
    }
  }
}
