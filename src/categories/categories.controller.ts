import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('findAllCategories')
  findAll() {
    return this.categoriesService.findAll();
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: number) {
    return this.categoriesService.findOne(id);
  }

}
