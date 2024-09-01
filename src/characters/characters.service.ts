import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { ArrayContains, ILike, In, Repository } from 'typeorm';
import { CreateCharacterDTO } from './dtos/create-character.dto';
import {
  CharacterFilters,
  CharacterParams,
  SearchFilters,
} from 'src/utils/filters';
import { getLimitAndOffset } from 'src/utils/pagination.';
import { EditCharacterDTO } from './dtos/edit-character.dto';
import {
  isGender,
  isGenre,
  isImportance,
  isPairing,
  isRelationship,
  isRomanticOrientation,
  isSexualOrientation,
  isTypeOfRep,
} from 'src/utils/enumValidation';
import { knex } from 'src/utils/knex';
import { Story } from 'src/stories/story.entity';
import {
  RomanticOrientation,
  SexualOrientation,
  TypeOfRep,
} from 'src/utils/types';

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

    const characters = await this.charactersRepository.findAndCount({
      where: {
        approved: true,
        ...(filters?.relationships && {
          relationships: ArrayContains(filters?.relationships),
        }),
        ...(filters?.genres && {
          genres: ArrayContains(filters?.genres),
        }),
        ...(filters?.typeOfRep && {
          typeOfRep: In(filters?.typeOfRep),
        }),
        ...(filters?.importance && {
          importance: In(filters?.importance),
        }),
        ...(filters?.pairing && {
          pairing: In(filters?.pairing),
        }),
        ...(filters?.sexualOrientation && {
          sexualOrientation: In(filters?.sexualOrientation),
        }),
        ...(filters?.romanticOrientation && {
          romanticOrientation: In(filters?.romanticOrientation),
        }),
        ...(filters?.gender && {
          gender: In(filters?.gender),
        }),
      },
      skip: offset,
      take: limit,
    });

    return { result: characters[0], total: characters[1] };
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

    const stories = await this.storiesRepository.find({
      where: {
        title: ILike(`%${queries.search}%`),
      },
      relations: {
        characters: true,
      },

      skip: offset,
      take: limit,
    });

    const storyCharacters = [];

    stories.forEach((story) => {
      story.characters.forEach((character) => {
        storyCharacters.push(character);
      });
    });

    const actualResult = [...result, ...storyCharacters];
    const unique = [...new Set(actualResult)];

    return {
      result: unique,
      total: total?.count ? Number(total?.count) + storyCharacters.length : 0,
    };
  }

  async getAllCharacters(params: CharacterParams) {
    const { limit, offset } = getLimitAndOffset(params.amount, params.page);

    const characters = await this.charactersRepository.findAndCount({
      where:
        params.param === 'AROMANTIC'
          ? {
              approved: true,
              romanticOrientation: In([
                RomanticOrientation.Aroflux,
                RomanticOrientation.Aromantic,
                RomanticOrientation.Grayromantic,
                RomanticOrientation.Demiromantic,
                RomanticOrientation.Arospec,
                RomanticOrientation.Wtfromantic,
              ]),
            }
          : params.param === 'ASEXUAL'
          ? {
              approved: true,
              sexualOrientation: In([
                SexualOrientation.Asexual,
                SexualOrientation.Grayasexual,
                SexualOrientation.Demisexual,
                SexualOrientation.Acespec,
              ]),
            }
          : null,

      skip: offset,
      take: limit,
    });

    return { result: characters[0], total: characters[1] };
  }

  async getCanonCharacters(params: CharacterParams) {
    const { limit, offset } = getLimitAndOffset(params.amount, params.page);

    const characters = await this.charactersRepository.findAndCount({
      where:
        params.param === 'AROMANTIC'
          ? {
              approved: true,
              romanticOrientation: In([
                RomanticOrientation.Aroflux,
                RomanticOrientation.Aromantic,
                RomanticOrientation.Grayromantic,
                RomanticOrientation.Demiromantic,
                RomanticOrientation.Arospec,
                RomanticOrientation.Wtfromantic,
              ]),
              typeOfRep: In([TypeOfRep.On_Page, TypeOfRep.Word_Used]),
            }
          : params.param === 'ASEXUAL'
          ? {
              approved: true,
              sexualOrientation: In([
                SexualOrientation.Asexual,
                SexualOrientation.Grayasexual,
                SexualOrientation.Demisexual,
                SexualOrientation.Acespec,
              ]),
              typeOfRep: In([TypeOfRep.On_Page, TypeOfRep.Word_Used]),
            }
          : null,
      skip: offset,
      take: limit,
    });

    return { result: characters[0], total: characters[1] };
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

  async removeStoryFromCharacter(id: string, storyId: string) {
    const character = await this.charactersRepository.findOne({
      where: { id },
      relations: ['stories'],
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const story = await this.storiesRepository.findOne({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('No story found.');
    }

    character.removeStory(story);

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
      throw new NotFoundException('Character not found');
    }

    character.approve();

    await this.charactersRepository.save(character);

    return {
      character,
    };
  }

  async getAllAdminCharacters(status: boolean, search: string) {
    const query = knex('characters').select('*').where('approved', status);
    const totalQuery = knex('characters').where('approved', status).count();

    if (search) {
      query.andWhere((qb) => {
        qb.whereILike('name', `%${search}%`)
          .orWhereILike('author', `%${search}%`)
          .orWhereILike('series', `%${search}%`);
      });

      totalQuery.andWhere((qb) => {
        qb.whereILike('name', `%${search}%`)
          .orWhereILike('author', `%${search}%`)
          .orWhereILike('series', `%${search}%`);
      });
    }

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }
}
