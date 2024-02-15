/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { NestExpressApplication } from '@nestjs/platform-express';
// import * as path from 'path';
// import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(path.join(__dirname, '..', 'public'));
  // Configure Multer
  // const storage = multer.diskStorage({
  //   destination: './public/uploads', // Set your desired destination for storing files
  //   filename: (req, file, cb) => {
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  //   },
  // });

  // app.use(multer({ storage }).single('file')); // 'file' should match the field name in your form
  
  // console.log(__dirname);
  // app.use(cors());
  app.use(cors({
    origin: '*',
  }));
  await app.listen(3001);
}
bootstrap();
