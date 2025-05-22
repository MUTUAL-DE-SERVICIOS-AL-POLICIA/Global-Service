import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

/**
 * Servicio encargado de la lógica de negocio relacionada con las categorías.
 * Proporciona métodos para consultar información de categorías desde la base de datos.
 */
@Injectable()
export class CategoriesService {
  /**
   * Constructor del servicio CategoriesService.
   * Inyecta el repositorio de TypeORM para la entidad Category.
   * @param categoriesRepository utilizado para interactuar con la tabla 'category'.
   */
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Busca y devuelve una lista solo con 'id' y 'name'. de todas las categorías disponibles.
   * @returns Una promesa que resuelve con un array de objetos Category solo con 'id' y 'name'.
   */
  async findAll(): Promise<Partial<Category>[]> {
    return this.categoriesRepository.find({
      select: ['id', 'name'],
    });
  }

  /**
   * Busca y devuelve una categoría específica por su ID.
   * Si la categoría no es encontrada, lanza una excepción RpcException(codigo 404).
   * @param id El ID numérico de la categoría a buscar.
   * @returns Una promesa que resuelve con el objeto Category completo si es encontrado.
   * @throws RpcException Si no se encuentra una categoría con el ID proporcionado (código 404).
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new RpcException({
        message: `Category with ID: ${id} not found`,
        code: 404,
      });
    }
    return category;
  }
}
