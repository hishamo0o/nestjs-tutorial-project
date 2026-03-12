import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDTO } from './DTO/create-tweet.dto';
import { UpdateTweetDto } from './DTO/update-tweet.dto';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get(':userId')
  async getTweets(@Param('userId', ParseIntPipe) userId: number) {
    const res = await this.tweetService.getTweetsByUserId(userId);
    console.log(res );
    return res;
  }

  @Post()
  public createTweet(@Body() tweet: CreateTweetDTO) {
    return this.tweetService.createTweet(tweet);
  }

  @Patch()
  updateTweet(@Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetService.updateTweet(updateTweetDto);
  }

  @Delete(':id')
  deleteTweet(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.deleteTweet(id);
  }
}
