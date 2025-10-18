import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  private MAX_RETRIES = 5;
  private RETRIES = 0;
  private RETRY_DELAY_MS = 2000;
  async onModuleInit() {
    while (this.RETRIES < this.MAX_RETRIES) {
      try {
        await this.$connect();
        console.log('✅ Connected to the databse successfully!');
        return;
      } catch (err) {
        this.RETRIES++;
        console.error(
          `❌ Database connection failed (attempt ${this.RETRIES}):`,
          err.message,
        );

        if (this.RETRIES >= this.MAX_RETRIES) {
          console.error('🚫 Could not connect to the database. Exiting now...');
          process.exit(1);
        }

        console.log(`🔄 Retrying in ${this.RETRY_DELAY_MS / 1000} seconds...`);
        await new Promise((resolve) =>
          setTimeout(resolve, this.RETRY_DELAY_MS),
        );
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🛑 Disconnected from the database');
  }
}
