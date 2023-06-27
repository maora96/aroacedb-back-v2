import { Injectable, NotFoundException } from '@nestjs/common';
// import { CharactersRepository } from '../repositories/characters.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { In, Repository } from 'typeorm';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import { CharacterFilters, SearchFilters } from 'src/utils/filters';
import { getLimitAndOffset } from 'src/utils/pagination.';
import { EditCharacterDTO } from './dtos/edit-character.dto';
import {
  isAgeGroup,
  isGender,
  isGenre,
  isImportance,
  isLength,
  isPairing,
  isRelationship,
  isRomanticOrientation,
  isSexualOrientation,
  isTypeOfRep,
} from 'src/utils/enumValidation';
import { knex } from 'src/utils/knex';
import { Story } from 'src/stories/story.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
  ) {}

  async getManyAdvanced(filters: CharacterFilters) {
    const { limit, offset } = getLimitAndOffset(filters.amount, filters.page);

    const query = knex('characters').select('*').where('approved', true);
    const totalQuery = knex('characters').where('approved', true).count();

    if (filters.typeOfRep) {
      query.andWhere('typeOfRep', '=', filters.typeOfRep);
      totalQuery.andWhere('typeOfRep', '=', filters.typeOfRep);
    }

    if (filters.importance) {
      query.andWhere('importance', '=', filters.importance);
      totalQuery.andWhere('importance', '=', filters.importance);
    }

    if (filters.pairing) {
      query.andWhere('pairing', '=', filters.pairing);
      totalQuery.andWhere('pairing', '=', filters.pairing);
    }
    if (filters.relationships) {
      query.andWhereRaw('? =ANY(relationships)', filters.relationships);
      totalQuery.andWhereRaw('? =ANY(relationships)', filters.relationships);
    }

    if (filters.genres) {
      query.andWhereRaw('? =ANY(genres)', filters.genres);
      totalQuery.andWhereRaw('? =ANY(genres)', filters.genres);
    }

    if (filters.sexualOrientation) {
      query.andWhere('sexualOrientation', '=', filters.sexualOrientation);
      totalQuery.andWhere('sexualOrientation', '=', filters.sexualOrientation);
    }

    if (filters.romanticOrientation) {
      query.andWhere('romanticOrientation', '=', filters.romanticOrientation);
      totalQuery.andWhere(
        'romanticOrientation',
        '=',
        filters.romanticOrientation,
      );
    }

    if (filters.gender) {
      query.andWhere('gender', '=', filters.gender);
      totalQuery.andWhere('gender', '=', filters.gender);
    }

    query.limit(limit).offset(offset);

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }

  async getMany(queries: SearchFilters) {
    const { limit, offset } = getLimitAndOffset(queries.amount, queries.page);

    const query = knex('characters').select('*').where('approved', true);
    const totalQuery = knex('characters').where('approved', true).count();

    if (queries.search) {
      query.andWhere((qb) => {
        qb.whereILike('name', `%${queries.search}%`)
          .orWhereILike('author', `%${queries.search}%`)
          .orWhereILike('series', `%${queries.search}%`);

        if (isGenre(queries.search)) {
          qb.orWhereRaw('? =ANY(genres)', queries.search);
        }
        if (isRelationship(queries.search)) {
          qb.orWhereRaw('? =ANY(relationships)', queries.search);
        }

        if (isTypeOfRep(queries.search)) {
          qb.orWhere('typeOfRep', '=', queries.search);
        }
        if (isImportance(queries.search)) {
          qb.orWhere('importance', '=', queries.search);
        }

        if (isPairing(queries.search)) {
          qb.orWhere('pairing', '=', queries.search);
        }

        if (isSexualOrientation(queries.search)) {
          qb.orWhere('sexualOrientation', '=', queries.search);
        }

        if (isRomanticOrientation(queries.search)) {
          qb.orWhere('romanticOrientation', '=', queries.search);
        }

        if (isGender(queries.search)) {
          qb.orWhere('gender', '=', queries.search);
        }
      });

      totalQuery.andWhere((qb) => {
        qb.whereILike('name', `%${queries.search}%`)
          .orWhereILike('author', `%${queries.search}%`)
          .orWhereILike('series', `%${queries.search}%`);

        if (isGenre(queries.search)) {
          qb.orWhereRaw('? =ANY(genres)', queries.search);
        }
        if (isRelationship(queries.search)) {
          qb.orWhereRaw('? =ANY(relationships)', queries.search);
        }

        if (isTypeOfRep(queries.search)) {
          qb.orWhere('typeOfRep', '=', queries.search);
        }
        if (isImportance(queries.search)) {
          qb.orWhere('importance', '=', queries.search);
        }

        if (isPairing(queries.search)) {
          qb.orWhere('pairing', '=', queries.search);
        }

        if (isSexualOrientation(queries.search)) {
          qb.orWhere('sexualOrientation', '=', queries.search);
        }

        if (isRomanticOrientation(queries.search)) {
          qb.orWhere('romanticOrientation', '=', queries.search);
        }

        if (isGender(queries.search)) {
          qb.orWhere('gender', '=', queries.search);
        }
      });
    }

    query.limit(limit).offset(offset);

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }

  getRandom() {
    return this.charactersRepository
      .createQueryBuilder('characters')
      .select()
      .where('characters.approved = :status', { status: true })
      .orderBy('RANDOM()')
      .getOne();
  }

  async getOne(id: string) {
    const character = await this.charactersRepository.findOne({
      where: { id },
      relations: ['stories'],
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    return character;
  }

  getFavorites(favorites: string[]) {
    return this.charactersRepository.find({ where: { id: In(favorites) } });
  }

  create(createCharacterDTO: CreateCharacterDTO) {
    const {
      name,
      author,
      series,
      genres,
      cover,
      typeOfRep,
      importance,
      pairing,
      relationships,
      notesAndWarnings,
      sexualOrientation,
      romanticOrientation,
      gender,
      approved,
    } = createCharacterDTO;
    const character = new Character(
      name,
      author,
      series,
      genres,
      cover,
      typeOfRep,
      importance,
      pairing,
      relationships,
      sexualOrientation,
      romanticOrientation,
      gender,
      notesAndWarnings,
      approved,
    );

    return this.charactersRepository.save(character);
  }

  async edit(id: string, editCharacterDTO: EditCharacterDTO) {
    const character = await this.charactersRepository.findOne({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    character.edit(editCharacterDTO);

    return this.charactersRepository.save(character);
  }

  async delete(id: string) {
    const character = await this.charactersRepository.findOne({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }
    return this.charactersRepository.remove(character);
  }

  async editStories(id: string, storiesIds: string[]) {
    const character = await this.charactersRepository.findOne({
      where: { id },
      relations: ['stories'],
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const stories = await this.storiesRepository.find({
      where: { id: In(storiesIds) },
    });

    if (!stories) {
      throw new NotFoundException('No stories found.');
    }

    character.addStory(stories);

    await this.charactersRepository.save(character);

    return {
      character,
    };
  }

  async getRecentlyAdded() {
    const characters = await this.charactersRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });

    return characters;
  }

  async approve(id: string) {
    const character = await this.charactersRepository.findOne({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException('Story not found');
    }

    character.approve();

    await this.charactersRepository.save(character);

    return {
      character,
    };
  }
}
