import { Module } from '@nestjs/common';
// import { NewsService } from './news.service';
// import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '@/news/entities/news.entity';
import { NewsCategory } from '@/news_category/entities/news_category.entity';
import { Property } from '@/properties/entities/property.entity';
import { NewsImages } from '@/news/entities/news_images.entity';
import { DeviceToken } from '@/device-token/entities/device-token.entity';
// import { FcmModule } from '@/fcm/fcm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      News,
      NewsCategory,
      Property,
      NewsImages,
      DeviceToken,
    ]),
    // FcmModule,
  ],
  // controllers: [NewsController],
  // providers: [NewsService],
})
export class NewsModule {}
