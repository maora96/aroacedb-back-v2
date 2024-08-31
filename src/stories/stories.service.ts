import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, In, Repository } from 'typeorm';
import { SearchFilters, StoriesFilters } from 'src/utils/filters';
import { getLimitAndOffset } from 'src/utils/pagination.';
import {
  isAgeGroup,
  isGenre,
  isLength,
  isTypeOfRep,
} from 'src/utils/enumValidation';
import { knex } from 'src/utils/knex';
import { Story } from './story.entity';
import { CreateStoryDTO } from './dtos/create-story.dto';
import { EditStoryDTO } from './dtos/edit-story.dto';
import { Character } from 'src/characters/character.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
    @InjectRepository(Character)
    private charactersRepository: Repository<Character>,
  ) {}

  async getManyAdvanced(filters: StoriesFilters) {
    const { limit, offset } = getLimitAndOffset(filters.amount, filters.page);

    const stories = await this.storiesRepository.findAndCount({
      where: {
        approved: true,
        ...(filters?.genres && {
          genres: ArrayContains(filters?.genres),
        }),
        ...(filters?.ageGroup && {
          ageGroup: In(filters?.ageGroup),
        }),
        ...(filters?.length && {
          length: In(filters?.length),
        }),
      },
      skip: offset,
      take: limit,
    });

    return { result: stories[0], total: stories[1] };
  }

  async getMany(queries: SearchFilters) {
    const { limit, offset } = getLimitAndOffset(queries.amount, queries.page);

    const query = knex('stories').select('*').where('approved', true);
    const totalQuery = knex('stories').where('approved', true).count();

    if (queries.search) {
      query.andWhere((qb) => {
        qb.whereILike('title', `%${queries.search}%`)
          .orWhereILike('author', `%${queries.search}%`)
          .orWhereILike('series', `%${queries.search}%`);

        if (isGenre(queries.search)) {
          qb.orWhereRaw('? =ANY(genres)', queries.search);
        }

        if (isAgeGroup(queries.search)) {
          qb.orWhere('ageGroup', '=', queries.search);
        }
        if (isLength(queries.search)) {
          qb.orWhere('length', '=', queries.search);
        }
      });

      totalQuery.andWhere((qb) => {
        qb.whereILike('title', `%${queries.search}%`)
          .orWhereILike('author', `%${queries.search}%`)
          .orWhereILike('series', `%${queries.search}%`);

        if (isGenre(queries.search)) {
          qb.orWhereRaw('? =ANY(genres)', queries.search);
        }

        if (isAgeGroup(queries.search)) {
          qb.orWhere('ageGroup', '=', queries.search);
        }
        if (isLength(queries.search)) {
          qb.orWhere('length', '=', queries.search);
        }
      });
    }

    query.limit(limit).offset(offset);

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }

  getRandom() {
    return this.storiesRepository
      .createQueryBuilder('stories')
      .select()
      .where('characters.approved = :status', { status: true })
      .orderBy('RANDOM()')
      .getOne();
  }

  async getOne(id: string) {
    const story = await this.storiesRepository.findOne({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const characters = await this.charactersRepository.find({
      where: {
        stories: {
          id: id,
        },
      },
    });

    const completeStory = { ...story, characters };

    return completeStory;
  }

  getFavorites(favorites: string[]) {
    return this.storiesRepository.find({ where: { id: In(favorites) } });
  }

  async createMany(createStoryDTO: CreateStoryDTO[]) {
    const createdStories = [];
    for (const story of createStoryDTO) {
      const newStory = await this.create(story);
      createdStories.push(createdStories);
    }

    return createdStories;
  }

  create(createStoryDTO: CreateStoryDTO) {
    const {
      title,
      author,
      series,
      volume,
      genres,
      cover,
      description,
      length,
      ageGroup,
      notesAndWarnings,
      repNotesAndWarnings,
      approved,
    } = createStoryDTO;

    const character = new Story(
      title,
      author,
      series,
      volume,
      genres,
      cover,
      description,
      length,
      ageGroup,
      approved,
      notesAndWarnings,
      repNotesAndWarnings,
    );

    return this.storiesRepository.save(character);
  }

  async edit(id: string, editStoryDTO: EditStoryDTO) {
    const story = await this.storiesRepository.findOne({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    story.edit(editStoryDTO);

    return this.storiesRepository.save(story);
  }

  async delete(id: string) {
    const story = await this.storiesRepository.findOne({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }
    return this.storiesRepository.remove(story);
  }

  async editCharacters(id: string, charactersIds: string[]) {
    const story = await this.storiesRepository.findOne({
      where: { id },
      relations: ['characters'],
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const characters = await this.charactersRepository.find({
      where: { id: In(charactersIds) },
    });

    if (!characters) {
      throw new NotFoundException('No characters found.');
    }

    story.addCharacters(characters);
    await this.storiesRepository.save(story);

    return {
      story,
    };
  }

  async getRecentlyAdded() {
    const stories = await this.storiesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });

    return stories;
  }

  async approve(id: string) {
    const story = await this.storiesRepository.findOne({ where: { id } });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    story.approve();

    await this.storiesRepository.save(story);

    return {
      story,
    };
  }

  async getAllAdminStories(status: boolean, search: string) {
    const query = knex('stories').select('*').where('approved', status);
    const totalQuery = knex('stories').where('approved', status).count();

    if (search) {
      query.andWhere((qb) => {
        qb.whereILike('title', `%${search}%`)
          .orWhereILike('author', `%${search}%`)
          .orWhereILike('series', `%${search}%`);

        if (isGenre(search)) {
          qb.orWhereRaw('? =ANY(genres)', search);
        }
      });

      totalQuery.andWhere((qb) => {
        qb.whereILike('title', `%${search}%`)
          .orWhereILike('author', `%${search}%`)
          .orWhereILike('series', `%${search}%`);

        if (isGenre(search)) {
          qb.orWhereRaw('? =ANY(genres)', search);
        }
      });
    }

    const result = await query;
    const [total] = await totalQuery;

    return { result, total: total?.count ? Number(total?.count) : 0 };
  }
}
