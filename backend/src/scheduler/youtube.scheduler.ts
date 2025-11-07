// backend/src/scheduler/youtube-scheduler.ts
import cron from 'node-cron';
import { YoutubeService } from '../services/youtube.service';

// Run every 1 hours
cron.schedule('0 * * * *', async () => {
  console.log('Running YouTube video sync...');
  try {
    const result = await YoutubeService.fetchAndStoreVideos();
    console.log('YouTube sync completed:', result);
  } catch (error) {
    console.error('YouTube sync failed:', error);
  }
});

console.log('YouTube video scheduler started');