import { getRepository } from 'typeorm';
import { Score } from '../entity/Score';

export const getAllScores = async () => await getRepository(Score)
    .createQueryBuilder()
    .select('*')
    .getRawMany();

export const getScoreByIdUser = async (userId : number) => await getRepository(Score)
    .createQueryBuilder()
    .select('*')
    .where('userId = :userId', { userId : userId })
    .getRawOne();

export const getPointAverageByDate = async (date : string) => await getRepository(Score)
    .createQueryBuilder()
    .select('AVG(point) as average')
    .where('date = :date', { date : date })
    .getRawOne();

export const getLeaders = async () => await getRepository(Score)
    .createQueryBuilder()
    .select('idUser, SUM(point)as totalScore')
    .groupBy('idUser')
    .orderBy('totalScore', 'DESC')
    .limit(5)
    .getRawMany();


export const addScore = async (score : Score) => getRepository(Score).save(score);