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
} from './types';

export const isAgeGroup = (value: string): value is AgeGroup => {
  return Object.values<string>(AgeGroup).includes(value);
};

export const isLength = (value: string): value is Length => {
  return Object.values<string>(Length).includes(value);
};

export const isTypeOfRep = (value: string): value is TypeOfRep => {
  return Object.values<string>(TypeOfRep).includes(value);
};

export const isImportance = (value: string): value is Importance => {
  return Object.values<string>(Importance).includes(value);
};

export const isPairing = (value: string): value is Pairing => {
  return Object.values<string>(Pairing).includes(value);
};

export const isRelationship = (value: string): value is Relationship => {
  return Object.values<string>(Relationship).includes(value);
};

export const isSexualOrientation = (
  value: string,
): value is SexualOrientation => {
  return Object.values<string>(SexualOrientation).includes(value);
};

export const isRomanticOrientation = (
  value: string,
): value is RomanticOrientation => {
  return Object.values<string>(RomanticOrientation).includes(value);
};

export const isGender = (value: string): value is Gender => {
  return Object.values<string>(Gender).includes(value);
};

export const isGenre = (value: string): value is Genres => {
  return Object.values<string>(Genres).includes(value);
};
