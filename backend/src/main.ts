import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync } from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Statik fayllar (mahsulot rasmlari, datasheet PDF) — /uploads
  app.useStaticAssets(
    join(process.cwd(), process.env.UPLOADS_DIR ?? 'uploads'),
    { prefix: '/uploads/' },
  );

  // Web build'ni root'dan serving (Telegram Mini App — same-origin).
  // Yengil React Mini App: webapp/dist
  const webDir = join(process.cwd(), '..', 'webapp', 'dist');
  if (existsSync(webDir)) {
    app.useStaticAssets(webDir);
    // SPA fallback: /api va /uploads dan tashqari barcha GET -> index.html
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (
        req.method !== 'GET' ||
        req.path.startsWith('/api') ||
        req.path.startsWith('/uploads') ||
        req.path.includes('.')
      ) {
        return next();
      }
      res.sendFile(join(webDir, 'index.html'));
    });
  }

  const config = new DocumentBuilder()
    .setTitle('Quyoshli API')
    .setDescription("Solar e-commerce backend — REST API (spec 5-bo'lim)")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Quyoshli API: http://localhost:${port}/api/v1`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger:      http://localhost:${port}/api/docs`);
}
void bootstrap();
