import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from 'src/characters/character.entity';
import { Story } from 'src/stories/story.entity';
import { Repository } from 'typeorm';
import { knex } from 'src/utils/knex';
import { Permission } from './permissions.entity';
import { Parser } from '@json2csv/plainjs';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const comparison = this.compare(password, user.password);

    if (!comparison) {
      throw new UnauthorizedException('Login credentials incorret.');
    }

    const payload = { sub: user.id, name: user.name, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, password: string, name: string) {
    const hash = await this.hashData(password);
    const user = new User(name, email, hash);

    await this.usersRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async getStats() {
    const characters = await knex('characters').select('*');
    const stories = await knex('stories').select('*');

    const totalCharacters = characters.length;
    const totalStories = stories.length;
    const approvedCharacters = characters.filter(
      (character: Character) => character.approved === true,
    )?.length;
    const approvedStories = stories.filter(
      (story: Story) => story.approved === true,
    )?.length;
    const unapprovedCharacters = characters.filter(
      (character: Character) => character.approved === false,
    )?.length;
    const unapprovedStories = stories.filter(
      (story: Story) => story.approved === false,
    )?.length;

    return {
      totalCharacters,
      totalStories,
      approvedCharacters,
      approvedStories,
      unapprovedCharacters,
      unapprovedStories,
    };
  }

  async getPermissions() {
    const permissions = await this.permissionsRepository.find();

    return permissions;
  }

  async changePermission(id: string, status: boolean) {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    permission.changeStatus(status);

    await this.permissionsRepository.save(permission);

    return permission;
  }

  async downloadTable(table: string) {
    const parser = new Parser();

    let tableData;
    if (table === 'characters') {
      tableData = await this.charactersRepository.find();
    } else {
      tableData = await this.storiesRepository.find();
    }

    if (tableData) {
      const jsonData = JSON.parse(JSON.stringify(tableData));

      const csv = parser.parse(jsonData);

      writeFileSync(`${table}.csv`, '\ufeff' + csv, { encoding: 'utf16le' });

      const file = readFileSync(join(process.cwd(), `${table}.csv`));

      return file;
    }
  }
}
