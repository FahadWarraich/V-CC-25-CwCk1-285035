import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Use Helmet for security headers
  app.use(helmet());

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //transform payload to dto its mean it will be type and instance of that dto
      whitelist: true, //user only pass data in body that is mention in dto
      forbidNonWhitelisted: true, //this will through error
    }),
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('FitNation Promotion API')
    .setDescription('API for FitNation Gym Membership Promotion')
    .setVersion('1.0')
    .addTag('promotion')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
