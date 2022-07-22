import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IScore } from '../interfaces/IScore';
import { User } from './User';

@Entity('score')
export class Score implements Partial<IScore> {

    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    point : number;

    @Column()
    date : string;


    @ManyToOne(type => User, user => user.id, { onDelete : 'CASCADE' })
    @JoinColumn({ name : 'idUser' })
    user : User;

}
