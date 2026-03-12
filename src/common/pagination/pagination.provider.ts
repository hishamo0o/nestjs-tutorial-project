import { Injectable } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class PaginationProvider {
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
  ) {
    const findOptions: FindManyOptions<T> = {
      skip: paginationQueryDto.limit * (paginationQueryDto.page - 1),
      take: paginationQueryDto.limit,
    };
    if (where) {
      findOptions.where = where;
    }
    return await repository.find(findOptions);
  }
}
