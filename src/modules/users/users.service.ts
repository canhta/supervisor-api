import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { PaginationResultType } from 'src/utils/types/pagination-result.type';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(createProfileDto: CreateUserDto): Promise<User> {
    return this.repository.save(this.repository.create(createProfileDto));
  }

  findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
    return this.repository.findOne({ where: fields });
  }

  async findManyWithPagination({
    page,
    limit,
    search,
  }: IPaginationOptions): Promise<PaginationResultType<User>> {
    const [data, total] = await this.repository
      .createQueryBuilder('user')
      .where(
        new Brackets((qb) => {
          qb.where('user.fullName LIKE :search', { search: `%${search}%` })
            .orWhere('user.email LIKE :search', { search: `%${search}%` });
        }),
      )
      .skip(page * limit)
      .take(limit)
      .getManyAndCount();

    return { total, data };
  }

  async update(id: User['id'], payload: DeepPartial<User>): Promise<User> {
    return this.repository.save(this.repository.create({ id, ...payload }));
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.repository.softDelete(id);
  }
}
