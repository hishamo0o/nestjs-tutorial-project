import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTweetDTO } from './DTO/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './DTO/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { GetTweetQueryDto } from './DTO/get-tweet-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';

@Injectable()
export class TweetService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly hashtagService: HashtagService,
    private readonly paginationProvider:PaginationProvider
  ) {}

  public async createTweet(createTweetDTO: CreateTweetDTO) {
    const user = await this.userService.getUserById(createTweetDTO.userId);

    const hashtags = await this.hashtagService.findHashtags(
      createTweetDTO?.hashtags ?? [],
    );

    if (user) {
      const createdTweet = this.tweetRepository.create({
        ...createTweetDTO,
        user,
        hashtags,
      });
      return await this.tweetRepository.save(createdTweet);
    }
    throw new Error(
      `could not find the user with id : ${createTweetDTO.userId} to create a tweet`,
    );
  }

  async getTweetsByUserId(userId: number, pageQueryDto: PaginationQueryDto) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new NotFoundException(`can't find user with id ${userId}`);
    }

    // return await this.tweetRepository.find({ // commented to wrap it with the pagination using the pagination provider
    //   where: {
    //     user: {
    //       id: userId,
    //     },
    //   },
    //   // relations: ['user'],
    //   // relations: {
    //   //   user: true,
    //   //   hashtags: true,
    //   // }, //removed after enbaling eager loading in tweet.entity in order to do eager lodaing from the pagination provider
    //   skip: getTweetQueryDto.limit * (getTweetQueryDto.page - 1),
    //   take: getTweetQueryDto.limit,
    // });
    //limit : 10 , page : 1 , skip 0 and take 1-10 records
    //limit : 10 , page : 2 , skip 10 and take 11-20 records

    
    return await this.paginationProvider.paginateQuery(
      pageQueryDto , this.tweetRepository , {user:{id:userId}}
    );

  }

  async updateTweet(updateTweetDto: UpdateTweetDto) {
    //find all hashtags
    const hashtags = await this.hashtagService.findHashtags(
      updateTweetDto.hashtags ?? [],
    );
    const tweet = await this.tweetRepository.findOneBy({
      id: updateTweetDto.id,
    });
    //update the properity of the tweet
    if (!tweet)
      throw new Error(
        `can't find tweet with id : ${updateTweetDto.id} to modify ...`,
      );
    tweet.text = updateTweetDto.text ?? tweet.text;
    tweet.hashtags = hashtags;
    tweet.image = updateTweetDto.image ?? tweet.image;
    return await this.tweetRepository.save(tweet);
  }

  async deleteTweet(id: number) {
    await this.tweetRepository.delete({ id });
    return { deleted: true, id };
  }
}
