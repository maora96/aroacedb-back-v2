import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ChangePermissionDTO } from './dtos/change-permission.dto';
import { Response } from 'express';
import { SignInDTO } from './dtos/signin.dto';
import { SignUpDTO } from './dtos/signup.dto';
import { AuthGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('signin')
  async signIn(@Body() body: SignInDTO) {
    const content = await this.adminService.signIn(body.email, body.password);

    return content;
  }

  @Post('signup')
  async signUp(@Body() body: SignUpDTO) {
    const content = await this.adminService.signUp(
      body.email,
      body.password,
      body.name,
    );

    return content;
  }

  @Get('stats')
  async getStats() {
    const content = await this.adminService.getStats();

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Get('permissions')
  async getPermissions() {
    const content = await this.adminService.getPermissions();

    return { result: content };
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Patch('permissions/:id')
  async changePermission(
    @Param('id') id: string,
    @Body() body: ChangePermissionDTO,
  ) {
    const content = await this.adminService.changePermission(id, body.status);

    return { result: content };
  }
}
