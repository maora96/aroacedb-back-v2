import { Character } from 'src/characters/character.entity';
import { Genres, Length, TypeOfRep } from 'src/utils/types';
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
//   import { Character } from './character.entity';
//   import { EditCharacterDTO } from './dtos/edit-book.dto';

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

  @Column('text', { array: true })
  genres: Genres[];

  @Column({ type: 'text' })
  cover: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Length })
  length: Length;

  @Column({ type: 'text', array: true })
  typeOfRep: TypeOfRep[];

  @Column({ type: 'text', nullable: true })
  notesAndWarnings: string | null;

  @Column({ type: 'text', nullable: true })
  repBotesAndWarnings: string | null;

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
    genres: Genres[],
    cover: string,
    description: string,
    length: Length,
    typeOfRep: TypeOfRep[],
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
    this.genres = genres;
    this.cover = cover;
    this.description = description;
    this.length = length;
    this.typeOfRep = typeOfRep;
    this.approved = approved;
    this.notesAndWarnings = notesAndWarnings ?? null;
    this.repBotesAndWarnings = repNotesAndWarnings ?? null;
    this.createdAt = createdAt ?? new Date();
  }

  // editCharacters(characters: EditCharacterDTO[]) {
  //   this.characters.forEach((character: Character) => {
  //     characters.forEach((edittedCharacter: EditCharacterDTO) => {
  //       if (character.id === edittedCharacter.id) {
  //         character.edit(edittedCharacter);
  //       }
  //     });
  //   });
  // }
}
