import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { RolesService } from '~/roles/services/roles.service';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Find for a user by id.
   *
   * @param {string} id
   * @returns {UserDto|undefined} userDto or undefined
   */
  public async findById(id: string): Promise<UserDto | undefined> {
    const user = await this.usersRepository.findOne(id);

    return user ? plainToClass(UserDto, user) : undefined;
  }

  /**
   * This method returns the user with encrypted password.
   * Use only to validate authetication.
   *
   * @author Harlan Cleiton
   * @param email
   * @returns {User|undefined} user or undefined
   */
  public async findByEmailWithPassword(
    email: string,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });

    return user;
  }

  /**
   * Creates a new user.
   *
   * @throws {BadRequestException}
   * @param {CreateUserDto} createUserDto
   * @returns {UserDto} userDto
   */
  public async create({
    email,
    firstname,
    lastname,
    password,
    birthdate,
  }: CreateUserDto): Promise<UserDto> {
    const checkUser = await this.usersRepository.findOne({ where: { email } });

    if (checkUser) throw new BadRequestException('Email in use');

    const user = this.usersRepository.create({
      email,
      firstname,
      lastname,
      password,
      birthdate,
    });

    const userRole = await this.rolesService.getUserRole();
    user.roles = [userRole];

    await this.usersRepository.save(user);

    return plainToClass(UserDto, user);
  }
}
