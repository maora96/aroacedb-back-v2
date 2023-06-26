import {
  AgeGroup,
  Gender,
  Genres,
  Importance,
  Length,
  Pairing,
  Relationship,
  RomanticOrientation,
  SexualOrientation,
  TypeOfRep,
} from 'src/utils/types';

export interface PaginationParams {
  amount: number;
  page: number;
}

export interface CharacterFilters extends PaginationParams {
  genres?: Genres;
  typeOfRep?: TypeOfRep;
  importance?: Importance;
  pairing?: Pairing;
  relationships?: Relationship;
  sexualOrientation?: SexualOrientation;
  romanticOrientation?: RomanticOrientation;
  gender?: Gender;
}

export interface StoriesFilters extends PaginationParams {
  genres?: Genres;
  ageGroup?: AgeGroup;
  length?: Length;
}

export interface SearchFilters extends PaginationParams {
  search?: string;
}
