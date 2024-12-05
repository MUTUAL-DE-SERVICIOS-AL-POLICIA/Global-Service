import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
  ) {}

  async findAll(): Promise<Partial<City>[]> {
    return this.citiesRepository.find({
      select: [
        'id',
        'name',
        'firstShortened',
        'secondShortened',
        'thirdShortened',
        'companyPhones',
        'companyCellphones',
      ],
    });
  }

  async findOne(id: number): Promise<City> {
    const city = this.citiesRepository.findOneBy({ id });

    if (!city)
      throw new RpcException({
        message: `City with ID: ${id} not found`,
        code: 404,
      });
    return city;
  }
}
