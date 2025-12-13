import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';


import { AppModule } from './module/app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  SwaggerConfigInit(app);

  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
    console.log(`swagger => http://localhost:${port}/swagger`)
  })
}
bootstrap();
