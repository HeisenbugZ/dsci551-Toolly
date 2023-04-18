import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { capitalizeFirstLetter } from './types';

export interface ExistsValidatorOptions<T extends any> {
  fieldName?: keyof T & string;
  exists?: boolean;
}

export const ExistsValidator = <T extends any>(
  Model: new () => T,
  name: string,
  options: ExistsValidatorOptions<T> = {},
) => {
  const { fieldName = 'id', exists = true } = options;

  @ValidatorConstraint({
    name: `${name}${capitalizeFirstLetter(fieldName)}${
      exists ? 'Exists' : 'NotExist'
    }`,
    async: true,
  })
  @Injectable()
  class C implements ValidatorConstraintInterface {
    constructor(
      @InjectRepository(Model)
      private readonly repo: Repository<any>,
    ) {}

    async validate(value: any): Promise<boolean> {
      const file = await this.repo.findOne({ [fieldName]: value });

      if (exists) {
        return !!file;
      } else {
        return !file;
      }
    }

    defaultMessage(): string {
      if (exists) {
        return `${name} with ${fieldName} «$value» does not exist.`;
      } else {
        return `${name} with ${fieldName} «$value» already exists.`;
      }
    }
  }
  return C;
};
