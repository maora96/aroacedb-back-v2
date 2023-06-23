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
  ageGroup?: AgeGroup;
  length?: Length;
  typeOfRep?: TypeOfRep;
  importance?: Importance;
  pairing?: Pairing;
  relationships?: Relationship;
  sexualOrientation?: SexualOrientation;
  romanticOrientation?: RomanticOrientation;
  gender?: Gender;
}

export interface CharacterSearchFilters extends PaginationParams {
  search?: string;
}
