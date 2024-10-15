import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('categories.findAll')
  findAll() {
    return this.categoriesService.findAll();
  }

  @MessagePattern('category.findOne')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }
}
