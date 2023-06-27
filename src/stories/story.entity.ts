import { Character } from 'src/characters/character.entity';
import { AgeGroup, Genres, Length } from 'src/utils/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { EditStoryDTO } from './dtos/edit-story.dto';

@Entity({ name: 'stories' })
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  author: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  series: string | null;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  volume: number | null;

  @Column('text', { array: true })
  genres: Genres[];

  @Column({ type: 'text' })
  cover: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Length })
  length: Length;

  @Column({ type: 'enum', enum: AgeGroup, nullable: true })
  ageGroup: AgeGroup | null;

  @Column({ type: 'text', nullable: true })
  notesAndWarnings: string | null;

  @Column({ type: 'text', nullable: true })
  repNotesAndWarnings: string | null;

  @ManyToMany(() => Character)
  @JoinColumn()
  @JoinTable()
  characters: Character[] | null;

  @Column({ type: Boolean, default: false })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  constructor(
    title: string,
    author: string,
    series: string | null,
    volume: number | null,
    genres: Genres[],
    cover: string,
    description: string,
    length: Length,
    ageGroup: AgeGroup,
    approved: boolean,
    notesAndWarnings: string | null,
    repNotesAndWarnings: string | null,
    id?: string,
    createdAt?: Date | null,
  ) {
    this.id = id ?? uuid();
    this.title = title;
    this.author = author;
    this.series = series ?? null;
    this.volume = volume ?? null;
    this.genres = genres;
    this.cover = cover;
    this.description = description;
    this.length = length;
    this.ageGroup = ageGroup;
    this.approved = approved;
    this.notesAndWarnings = notesAndWarnings ?? null;
    this.repNotesAndWarnings = repNotesAndWarnings ?? null;
    this.createdAt = createdAt ?? new Date();
  }

  addCharacters(characters: Character[]) {
    if (this.characters.length === 0) {
      this.characters = characters;
    } else {
      const existingCharactersIds = this.characters.map(
        (character: Character) => character.id,
      );
      for (const character of characters) {
        if (!existingCharactersIds.includes(character.id)) {
          this.characters.push(character);
        }
      }
    }
  }

  edit(editStoryDTO: EditStoryDTO) {
    this.title = editStoryDTO.title ?? this.title;
    this.author = editStoryDTO.author ?? this.author;
    this.series = editStoryDTO.series ?? this.series;
    this.genres = editStoryDTO.genres ?? this.genres;
    this.cover = editStoryDTO.cover ?? this.cover;
    this.volume = editStoryDTO.volume ?? this.volume;
    this.description = editStoryDTO.description ?? this.description;
    this.ageGroup = editStoryDTO.ageGroup ?? this.ageGroup;
    this.length = editStoryDTO.length ?? this.length;
    this.repNotesAndWarnings =
      editStoryDTO.repNotesAndWarnings ?? this.repNotesAndWarnings;
    this.notesAndWarnings =
      editStoryDTO.notesAndWarnings ?? this.notesAndWarnings;
  }

  approve() {
    this.approved = true;
  }
}
