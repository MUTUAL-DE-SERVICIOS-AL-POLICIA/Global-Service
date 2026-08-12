import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ImportService } from './import.service';

@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @MessagePattern('global.initImport')
  async initImport(@Payload() data: {
    name: string;
    ftpPath: string;
    originalFileName: string;
    fileHash?: string;
    uploadedBy: string;
  }) {
    return this.importService.initImport(data);
  }

  @MessagePattern('global.finalizeImport')
  async finalizeImport(@Payload() data: {
    id: number;
    status: string;
    rowStart?: number;
    rowEnd?: number;
    totalRows?: number;
    errorMessage?: string;
  }) {
    return this.importService.finalizeImport(data);
  }
}
