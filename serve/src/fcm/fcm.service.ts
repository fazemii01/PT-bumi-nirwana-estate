import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import * as path from 'path';

@Injectable()
export class FcmService {
  constructor(
    @Inject('FIREBASE_APP') private readonly firebaseApp: admin.app.App,
  ) {}

  async sendNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: { [key: string]: string },
  ) {
    if (!tokens || tokens.length === 0) {
      console.log('No tokens provided. Skipping notification.');
      return;
    }

    const messages: Message[] = tokens.map((token) => ({
      token,
      notification: { title, body },
      data: data || {},
    }));

    try {
      const response = await this.firebaseApp.messaging().sendEach(messages);
      console.log('Successfully sent messages:', response);

      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        console.log('List of tokens that caused failures: ' + failedTokens);
      }
    } catch (error) {
      console.error('Error sending messages:', error);
      throw error;
    }
  }
}
