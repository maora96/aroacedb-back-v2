import { Injectable, NotFoundException } from '@nestjs/common';
// import { CharactersRepository } from '../repositories/characters.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { In, Repository } from 'typeorm';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import { CharacterFilters, CharacterSearchFilters } from 'src/utils/filters';
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

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  async getManyAdvanced(filters: CharacterFilters) {
    const { limit, offset } = getLimitAndOffset(filters.amount, filters.page);

    const query = knex('characters').select('*');
    const totalQuery = knex('characters').count();

    if (filters.ageGroup) {
      query.andWhere('ageGroup', '=', filters.ageGroup);
      totalQuery.andWhere('ageGroup', '=', filters.ageGroup);
    }

    if (filters.length) {
      query.andWhere('length', '=', filters.length);
      totalQuery.andWhere('length', '=', filters.length);
    }

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
    totalQuery.limit(limit).offset(offset);

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }

  async getMany(queries: CharacterSearchFilters) {
    const { limit, offset } = getLimitAndOffset(queries.amount, queries.page);

    const query = knex('characters').select('*');
    const totalQuery = knex('characters').count();

    if (queries.search) {
      query
        .whereILike('name', `%${queries.search}%`)
        .orWhereILike('author', `%${queries.search}%`)
        .orWhereILike('series', `%${queries.search}%`);

      if (isGenre(queries.search)) {
        query.orWhereRaw('? =ANY(genres)', queries.search);
      }
      if (isRelationship(queries.search)) {
        query.orWhereRaw('? =ANY(relationships)', queries.search);
      }
      if (isAgeGroup(queries.search)) {
        query.orWhere('ageGroup', '=', queries.search);
      }
      if (isLength(queries.search)) {
        query.orWhere('length', '=', queries.search);
      }
      if (isTypeOfRep(queries.search)) {
        query.orWhere('typeOfRep', '=', queries.search);
      }
      if (isImportance(queries.search)) {
        query.orWhere('importance', '=', queries.search);
      }

      if (isPairing(queries.search)) {
        query.orWhere('pairing', '=', queries.search);
      }

      if (isSexualOrientation(queries.search)) {
        query.orWhere('sexualOrientation', '=', queries.search);
      }

      if (isRomanticOrientation(queries.search)) {
        query.orWhere('romanticOrientation', '=', queries.search);
      }

      if (isGender(queries.search)) {
        query.orWhere('gender', '=', queries.search);
      }

      totalQuery
        .whereILike('name', `%${queries.search}%`)
        .orWhereILike('author', `%${queries.search}%`)
        .orWhereILike('series', `%${queries.search}%`);

      if (isGenre(queries.search)) {
        totalQuery.andWhereRaw('? =ANY(genres)', queries.search);
      }
      if (isRelationship(queries.search)) {
        totalQuery.orWhereRaw('? =ANY(relationships)', queries.search);
      }
      if (isAgeGroup(queries.search)) {
        totalQuery.orWhere('ageGroup', '=', queries.search);
      }
      if (isLength(queries.search)) {
        totalQuery.orWhere('length', '=', queries.search);
      }
      if (isTypeOfRep(queries.search)) {
        totalQuery.orWhere('typeOfRep', '=', queries.search);
      }
      if (isImportance(queries.search)) {
        totalQuery.orWhere('importance', '=', queries.search);
      }

      if (isPairing(queries.search)) {
        totalQuery.orWhere('pairing', '=', queries.search);
      }

      if (isSexualOrientation(queries.search)) {
        totalQuery.orWhere('sexualOrientation', '=', queries.search);
      }

      if (isRomanticOrientation(queries.search)) {
        totalQuery.orWhere('romanticOrientation', '=', queries.search);
      }

      if (isGender(queries.search)) {
        totalQuery.orWhere('gender', '=', queries.search);
      }
    }

    query.limit(limit).offset(offset);
    totalQuery.limit(limit).offset(offset);

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }

  getRandom() {
    return this.charactersRepository
      .createQueryBuilder('characters')
      .select()
      .orderBy('RANDOM()')
      .getOne();
  }

  getOne(id: string) {
    return this.charactersRepository.findOne({
      where: { id },
      relations: ['stories'],
    });
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
      ageGroup,
      length,
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
      ageGroup,
      length,
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
}
