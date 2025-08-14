import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './feedback.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = path.resolve(process.cwd(), 'uploads', 'data.json');


@Injectable()
export class FeedbackService {
  private feedbacks: (CreateFeedbackDto & { id: string; timestamp: string })[] =
    [];

  constructor() {
    // Load existing data from file if exists
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      this.feedbacks = JSON.parse(fileContent || '[]');
    }
  }

  private saveToFile() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.feedbacks, null, 2), 'utf8');
  }

  create(feedback: CreateFeedbackDto) {
    const data = {
      id: uuidv4(),
      ...feedback,
      timestamp: new Date().toISOString(),
    };
    this.feedbacks.push(data);
    this.saveToFile();
    return data;
  }

  findAll() {
    return this.feedbacks;
  }
}
