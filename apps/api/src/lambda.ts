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
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
          "style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
          "font-src": ["'self'", "fonts.gstatic.com"],
          "img-src": ["'self'", "data:", "cdn.jsdelivr.net"],
        },
      },
    })
  );

  const allowedOrigins = [
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : []),
    ...(process.env.ADMIN_URL ? process.env.ADMIN_URL.split(",") : []),
    "http://localhost:3000",
    "http://localhost:3001",
    "https://admin.juicevibe.lk",
    "https://juicevibe.lk",
    "https://www.juicevibe.lk",
  ].map((url) => url?.trim()).filter(Boolean) as string[];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isAllowed =
        origin.includes("juicevibe.lk") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".railway.app") ||
        origin.endsWith(".up.railway.app") ||
        allowedOrigins.includes(origin) ||
        isLocalhost;

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Origin",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
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
  SwaggerModule.setup("api/docs", app, document, {
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    ],
  });

  await app.init();

  // Return the underlying Express instance (already configured)
  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}
