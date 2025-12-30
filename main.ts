import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from "cookie-parser";

import { AppModule } from './module/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  SwaggerConfigInit(app);
  app.useStaticAssets("public");
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
    console.log(`swagger => http://localhost:${port}/swagger`)
  })
}
bootstrap();
