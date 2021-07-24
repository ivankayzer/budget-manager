import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: "'none'",
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

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
