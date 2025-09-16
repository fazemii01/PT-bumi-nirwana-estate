import { FcmService } from '@/fcm/fcm.service';
import { FirebaseProvider } from '@/fcm/firebase.provider';
import { Module } from '@nestjs/common';

@Module({
  providers: [FcmService, FirebaseProvider],
  exports: [FcmService, FirebaseProvider],
})
export class FcmModule {}
