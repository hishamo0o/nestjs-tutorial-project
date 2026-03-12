import { Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Hashtag } from './entities/hashtag.entity';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    private readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  public async createHashtag(createHashtagDto: CreateHashtagDto) {
    const createdHashtag = this.hashtagRepository.create(createHashtagDto);
    return await this.hashtagRepository.save(createdHashtag);
  }

  public async findHashtags(hashtags: number[]) {
    return await this.hashtagRepository.find({
      where: {
        id: In(hashtags),
      },
    });
  }

  async deleteHashtag(id: number) {
    await this.hashtagRepository.delete({ id });
    return { deleted: true, id };
  }

  async softdeleteHashtag(id: number) {
    await this.hashtagRepository.softDelete({ id });
    return { deleted: true, id };
  }
}
