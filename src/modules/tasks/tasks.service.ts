import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";
import { QuotesSyncService } from '../quotes/quotes.sync.service';
import { TasksRule } from './task.rules';
import { WeatherSyncService } from "../weather/weather.sync.service";
import { WeatherService } from "../weather/weather.service";
import { CronJob } from 'cron';

import { NotificationService } from "../notification/services/notification.service";
import { Country } from "../weather/schemas/enum/countries.enum";
import { UserService } from "../user/service/user.service";

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);
  private readonly rules: TasksRule[] = [];

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly quotesSyncService: QuotesSyncService,
    private readonly weatherSyncService: WeatherSyncService,
    private readonly weatherService: WeatherService,
    private readonly notificationService: NotificationService, // Inject notification service
    private readonly userService: UserService,
  ) {
    // Add default rules during initialization
    this.addRule(
      new TasksRule(
        'Sync Weekly Quotes',
        '0 0 * * *', // Every sunday midnight
        this.syncWeeklyQuotes.bind(this),
      ),
    );

    this.addRule(
      new TasksRule(
        'Send Daily Quote Notification',
        '0 9 * * *', // Every day at 9 AM
        this.sendDailyNotifications.bind(this),
      ),
    );

    this.addRule(
      new TasksRule(
        'Revoke all login code after every 5 minutes',
        '*/5 * * * *',
        this.autoResetLoginCode.bind(this),
      )
    )

    this.addRule(
      new TasksRule(
        'Auto generate habit plan for each user',
        '0 0 * * 0',
        this.autoReGeneratePlan.bind(this),
      )
    )

    // Relate to weather
    this.addRule(
      new TasksRule(
        'Sync Weather',
        '0 */3 * * *', // Every 3 hours
        this.syncWeather.bind(this),
      ),
    );
  }

  onModuleInit() {
    // Schedule all rules on initialization
    this.rules.forEach((rule) => this.scheduleRule(rule));
  }

  // Add a new rule
  addRule(rule: TasksRule) {
    this.rules.push(rule);
  }

  // Schedule a rule dynamically
  private scheduleRule(rule: TasksRule) {
    const job = new CronJob(rule.cronExpression, async () => {
      this.logger.log(`Executing rule: ${rule.ruleName}`);
      await rule.execute();
    });

    this.schedulerRegistry.addCronJob(rule.ruleName, job);
    job.start();
    this.logger.log(`Scheduled rule: ${rule.ruleName} with cron: ${rule.cronExpression}`);
  }

  async autoResetLoginCode(){
    this.logger.debug(`AutoReset Login Code`);
    await this.userService.processRevokeCode();
  }

  // Sync daily quotes
  async syncWeeklyQuotes() {
    this.logger.log('Syncing daily quotes...');
    await this.quotesSyncService.syncWeeklyQuotes();
    this.logger.log('Finished syncing daily quotes.');
  }

  // Sync weather
  async syncWeather() {
    this.logger.log('Syncing weather data for all locations...');
    const locations = Object.values(Country); // Hardcoded for now, can be dynamic later
    try {
      // Fetch weather data in batches to avoid API rate limits
      const batchSize = 5; // Adjust batch size based on rate limits
      for (let i = 0; i < locations.length; i += batchSize) {
        const batch = locations.slice(i, i + batchSize);
        await Promise.all(batch.map(location => this.fetchAndUpdateWeather(location)));
      }

      this.logger.log('Weather data synced successfully for all locations');
    } catch (error) {
      this.logger.error('Failed to sync weather data', error.stack);
    }
  }

  private async fetchAndUpdateWeather(location: string): Promise<void> {
    try {
      const weatherData = await this.weatherSyncService.fetchWeatherData(location);
      await this.weatherService.updateWeatherData(location, weatherData);
      this.logger.log(`Weather data synced successfully for location: ${location}`);
    } catch (error) {
      this.logger.error(`Failed to sync weather data for location: ${location}`, error.stack);
    }
  }

  // Send daily notifications
  async sendDailyNotifications() {
    this.logger.log('Sending daily quote notification via WebSocket');
    await this.notificationService.sendNotification({
      type: 'websocket',
      target: 'dailyNotification',
      message: 'Here is your daily motivational quote!',
    });
  }

  async autoReGeneratePlan(){
    this.logger.debug(`Start re-generate habit plan for all user`)
    await this.userService.processReGenerate();
  }

  async sendUserRegistrationNotification(email: string): Promise<void> {
    this.logger.log(`Sending success notification to ${email}`);
    await this.notificationService.sendNotification({
      type: 'email',
      target: email,
      message: 'Your account has been successfully created!',
    });
  }

  async sendWeatherNotification(weatherData: any) {
    this.logger.log('Sending weather update notification via WebSocket');
    await this.notificationService.sendNotification({
      type: 'websocket',
      target: 'weatherNotification',
      message: `Today's weather: ${weatherData.temperature}°C and ${weatherData.condition}`,
      additionalData: weatherData,
    });
  }

  // Manually trigger the weekly quotes update
  async triggerWeeklyQuotesUpdate() {
    this.logger.log('Manually triggering weekly quotes update...');
    await this.syncWeeklyQuotes();
    this.logger.log('Manual weekly quotes update completed.');
  }

  async triggerWeatherUpdate() {
    this.logger.log('Manually triggering weather update...');
    await this.syncWeather();
    this.logger.log('Manual weather update completed.');
  }
}
