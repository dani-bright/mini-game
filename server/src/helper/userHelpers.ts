import { getRepository } from 'typeorm';
import { User } from '../entity/User';

export const getAllUsers = async () => await getRepository(User)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const getUserById = async (id : number) => await getRepository(User)
    .createQueryBuilder()
    .select('*')
    .where('id = :id', { id : id })
    .getRawOne();


export const insertUser = async (user : User) => getRepository(User).save(user);


export const getUserByCredential = async (username : string) => await getRepository(User).createQueryBuilder()
    .select('*')
    .where('username = :username', { username : username })
    .getRawOne();

export const verifyCredential = async (login : string, password : string) => await getRepository(User)
    .createQueryBuilder('user')
    .where('username = :login', { login : login })
    .andWhere('password = :password', { login : password })
    .getRawMany();
