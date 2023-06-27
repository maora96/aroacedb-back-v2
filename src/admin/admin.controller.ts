import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ChangePermissionDTO } from './dtos/change-permission.dto';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    const content = await this.adminService.getStats();

    return { result: content };
  }

  @Get('permissions')
  async getPermissions() {
    const content = await this.adminService.getPermissions();

    return { result: content };
  }

  @Get('download/:table')
  async downloadTable(
    @Param('table') table: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${table}.csv"`,
    });
    const file = await this.adminService.downloadTable(table);

    return new StreamableFile(file);
  }

  @Patch('permissions/:id')
  async changePermission(
    @Param('id') id: string,
    @Body() body: ChangePermissionDTO,
  ) {
    const content = await this.adminService.changePermission(id, body.status);

    return { result: content };
  }
}
