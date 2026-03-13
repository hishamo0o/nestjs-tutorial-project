import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Paginated } from './paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST)private readonly request:Request){}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?:string[]
  ):Promise<Paginated<T>> {
    const findOptions: FindManyOptions<T> = {
      skip: paginationQueryDto.limit * (paginationQueryDto.page - 1),
      take: paginationQueryDto.limit,
    };
    if (where) {
      findOptions.where = where;
    }
    if(relations){
      findOptions.relations = relations;
    }
    const result = await repository.find(findOptions);

    const itemsPerPage = paginationQueryDto.limit;
    const totalItems = await repository.count(findOptions);
    const currentPage = paginationQueryDto.page;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const nextPage = currentPage === totalPages ? currentPage : currentPage + 1;
    const previousPage = currentPage === 1 ? currentPage : currentPage - 1;

    const baseUrl = this.request.protocol + '://' + this.request.headers.host + '/' ;
    const newUrl = new URL(this.request.url , baseUrl)

    const response:Paginated<T> = {
      data: result,
      meta: {
        itmesPerPage: itemsPerPage,
        totalItems: totalItems,
        currentPage: currentPage,
        totalPages: totalPages, 
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${1}`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${currentPage}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${paginationQueryDto.limit}&page=${previousPage}`,
      },
    };
    // console.log(`----------`);
    // console.log(newUrl);

    return response;
  }
}
