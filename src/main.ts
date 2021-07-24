import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    // Non swagger routes
    RegExp(/^(?!\/swagger).*/),
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: "'self'",
        },
      },
      frameguard: {
        action: 'deny',
      },
    }),
  );
  app.use(
    // Swagger routes
    RegExp(/^(\/swagger).*/),
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
      frameguard: {
        action: 'deny',
      },
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  const config = new DocumentBuilder()
    .setTitle('Finansist')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
