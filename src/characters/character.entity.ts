import { Story } from 'src/stories/story.entity';
import {
  Gender,
  Genres,
  Importance,
  Pairing,
  Relationship,
  RomanticOrientation,
  SexualOrientation,
  TypeOfRep,
} from 'src/utils/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { EditCharacterDTO } from './dtos/edit-character.dto';

@Entity({ name: 'characters' })
export class Character {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  author: string;

  @Column({ type: 'text', nullable: true })
  series: string | null;

  @Column({ type: 'text', array: true })
  genres: Genres[];

  @Column({ type: 'text', nullable: true })
  cover: string | null;

  @Column({ type: 'enum', enum: TypeOfRep })
  typeOfRep: TypeOfRep;

  @Column({ type: 'enum', enum: Importance })
  importance: Importance;

  @Column({ type: 'enum', enum: Pairing, nullable: true })
  pairing: Pairing | null;

  @Column({ type: 'text', nullable: true, array: true })
  relationships: Relationship[] | null;

  @Column({ type: 'text', nullable: true })
  notesAndWarnings: string | null;

  @Column({ type: 'enum', enum: SexualOrientation })
  sexualOrientation: SexualOrientation;

  @Column({ type: 'enum', enum: RomanticOrientation })
  romanticOrientation: RomanticOrientation;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToMany(() => Story)
  @JoinColumn()
  @JoinTable()
  stories: Story[] | null;

  constructor(
    name: string,
    author: string,
    series: string | null,
    genres: Genres[],
    cover: string | null,
    typeOfRep: TypeOfRep,
    importance: Importance,
    pairing: Pairing | null,
    relationships: Relationship[] | null,
    sexualOrientation: SexualOrientation,
    romanticOrientation: RomanticOrientation,
    gender: Gender,
    notesAndWarnings: string | null,
    approved: boolean,
    createdAt?: Date | null,
    id?: string,
  ) {
    this.id = id ?? uuid();
    this.name = name;
    this.author = author;
    this.series = series ?? null;
    this.genres = genres;
    this.cover = cover;
    this.typeOfRep = typeOfRep;
    this.importance = importance;
    this.pairing = pairing ?? null;
    this.relationships = relationships ?? null;
    this.sexualOrientation = sexualOrientation;
    this.romanticOrientation = romanticOrientation;
    this.gender = gender;
    this.notesAndWarnings = notesAndWarnings ?? null;
    this.approved = approved;
    this.createdAt = createdAt ?? new Date();
  }

  edit(editCharacterDTO: EditCharacterDTO) {
    this.name = editCharacterDTO.name ?? this.name;
    this.author = editCharacterDTO.author ?? this.author;
    this.series = editCharacterDTO.series ?? this.series;
    this.genres = editCharacterDTO.genres ?? this.genres;
    this.cover = editCharacterDTO.cover ?? this.cover;
    this.typeOfRep = editCharacterDTO.typeOfRep ?? this.typeOfRep;
    this.importance = editCharacterDTO.importance ?? this.importance;
    this.pairing = editCharacterDTO.pairing ?? this.pairing;
    this.relationships = editCharacterDTO.relationships ?? this.relationships;
    this.sexualOrientation =
      editCharacterDTO.sexualOrientation ?? this.sexualOrientation;
    this.romanticOrientation =
      editCharacterDTO.romanticOrientation ?? this.romanticOrientation;
    this.gender = editCharacterDTO.gender ?? this.gender;
    this.notesAndWarnings =
      editCharacterDTO.notesAndWarnings ?? this.notesAndWarnings;
  }

  addStory(stories: Story[]) {
    if (this.stories.length === 0) {
      this.stories = stories;
    } else {
      const existingStoriesIds = this.stories.map((story: Story) => story.id);
      for (const story of stories) {
        if (!existingStoriesIds.includes(story.id)) {
          this.stories.push(story);
        }
      }
    }
  }

  removeStory(story: Story) {
    if (this.stories.length !== 0) {
      const newStories = this.stories.filter(
        (str: Story) => str.id !== story.id,
      );
      this.stories = newStories;
    }
  }

  approve() {
    this.approved = true;
  }
}
