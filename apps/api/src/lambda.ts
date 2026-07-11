import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

// Cached app instance — reused across warm serverless invocations
let cachedApp: ReturnType<typeof Object.create> | null = null;

export async function bootstrapLambda() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["error", "warn"],
  });

  app.setGlobalPrefix("api");
  app.use(helmet());

  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    process.env.ADMIN_URL || "http://localhost:3001",
  ].filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Juice Vibe API")
    .setDescription("Premium tropical juice café API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.init();

  // Return the underlying Express instance (already configured)
  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}
