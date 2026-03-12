// import { Injectable, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  // private readonly logger = new Logger(AppService.name)
  // constructor(private readonly configService:ConfigService){}

  // onModuleInit() {
  //   const syncValue = this.configService.get<boolean>('database.synchronize');
    
  //   this.logger.log(`Database Synchronize setting: ${syncValue}`);
    
  //   // To see the entire database config object (if defined in a custom config file)
  //   const dbConfig = this.configService.get('database');
  //   console.log('Full Database Config:', dbConfig);
  // }

  getHello(): string {
    return 'Hello World!';
  }
}
