import * as dotenv from "dotenv";
import { join } from "path";
dotenv.config({ path: join(__dirname, "..", "..", "..", ".env") });

if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
  delete process.env.CLOUDINARY_URL;
}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

import { NestExpressApplication } from "@nestjs/platform-express";
import { json, urlencoded } from "express";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));

  // Only serve uploads from disk when running locally (not on Vercel serverless)
  if (process.env.NODE_ENV !== "production") {
    app.useStaticAssets(join(process.cwd(), "public", "uploads"), {
      prefix: "/uploads/",
    });
  }

  app.setGlobalPrefix("api");

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
          "style-src": ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
          "font-src": ["'self'", "fonts.gstatic.com"],
          "img-src": ["'self'", "data:", "cdn.jsdelivr.net", "res.cloudinary.com", "http:", "https:", "blob:"],
        },
      },
    })
  );

  const allowedOrigins = [
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : []),
    ...(process.env.ADMIN_URL ? process.env.ADMIN_URL.split(",") : ["http://localhost:3001"]),
  ].map((url) => url.trim()).filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);
      
      // Allow local development origins (localhost or 127.0.0.1 on any port) dynamically
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      
      // Allow any vercel.app, netlify.app, railway.app, or juicevibe.lk domain automatically
      if (
        origin.includes("juicevibe.lk") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".netlify.app") ||
        origin.endsWith(".railway.app") ||
        origin.endsWith(".up.railway.app") ||
        origin.endsWith(".lk") ||
        allowedOrigins.includes(origin) ||
        isLocalhost
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

  let port = process.env.PORT ? parseInt(String(process.env.PORT), 10) : 4000;
  const host = process.env.HOST || "0.0.0.0";

  try {
    await app.listen(port, host);
  } catch (err: any) {
    if (err.code === "EACCES" || err.code === "EADDRINUSE") {
      logger.warn(`Port ${port} is reserved or blocked by host (${err.code}). Falling back to port 4200...`);
      port = 4200;
      await app.listen(port, host);
    } else {
      throw err;
    }
  }

  logger.log(`Server running on http://${host}:${port}`);
  logger.log(`API docs available at http://${host}:${port}/api/docs`);
}

bootstrap();
