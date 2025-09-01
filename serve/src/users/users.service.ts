import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@/users/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepositoty: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const exitingEmial = await this.findOneByEmail(createUserDto.email);
    if (exitingEmial) throw new ConflictException('Email already exits');

    const user = new User();
    if (createUserDto.password_hash && createUserDto.password_hash != '') {
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(
        createUserDto.password_hash,
        salt,
      );
      user.password_hash = password_hash;
    }
    if (createUserDto.phone_number && createUserDto.phone_number != '') {
      user.phone_number = createUserDto.phone_number;
    }
    user.full_name = createUserDto.full_name;
    user.email = createUserDto.email;
    return this.usersRepositoty.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepositoty.find();
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepositoty.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user tidak ditemukan');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepositoty.findOneBy({
      email,
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepositoty.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User tidak ditemukan dengan id ${id}`);
    }
    const salt = await bcrypt.genSalt();

    Object.assign(user, updateUserDto);
    if (updateUserDto.password_hash) {
      const new_passsword = await bcrypt.hash(
        updateUserDto.password_hash,
        salt,
      );
      user.password_hash = new_passsword;
      console.log(new_passsword);
    }

    return await this.usersRepositoty.save(user);
  }

  async remove(id: string) {
    const user = await this.usersRepositoty.delete({ id });
    if (user) {
      return { message: 'Delete successful' };
    }
  }
}
