import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('categories.findAll')
  findAllCategories() {
    return this.categoriesService.findAllCategories();
  }

  @MessagePattern('categories.findOne')
  findOneCategory(@Payload('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOneCategory(id);
  }
}
