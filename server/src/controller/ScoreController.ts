import { Request, Response } from 'express';
import { Score } from '../entity/Score';
import { getAllScores, addScore, getPointAverageByDate, getLeaders } from '../helper/scoreHelpers';
import { getRepository } from 'typeorm';
import { getUserById } from '../helper/userHelpers';

export default class ScoreController {

    static async getAVGPointsByDate(req : Request, res : Response) {
        try {
            const date = req.body.selectedDate;
            const averagePoints = await getPointAverageByDate(date);
            const average = parseFloat(averagePoints.average).toFixed(2);
            return res.status(200).json({
                average
            });
        } catch (e) {
            return res.status(500).json({
                'message' : e.message
            });
        }
    }

    static async getScoreLeaders(req : Request, res : Response) {
        try {
            const leaders = await getLeaders();
            return res.status(200).json({
                leaders
            });
        } catch (e) {
            return res.status(500).json({
                'message' : e.message
            });
        }
    }

    static async getAllScores(req : Request, res : Response) {
        try {
            const scores = await getAllScores();
            return res.status(200).json({
                scores
            });
        } catch (e) {
            return res.status(500).json({
                'message' : e.message
            });
        }
    }

    static async add(req : Request, res : Response) {
        const scoreEntity : Score = new Score();

        const userEntity = await getUserById(req.body.idUser);

        try {
            scoreEntity.point = req.body.point;
            scoreEntity.date = req.body.date;
            scoreEntity.user = userEntity;
            const score = await addScore(scoreEntity);

            return res.status(200).json({
                score,
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message : e.message
            });
        }
    }

    static async remove(req : Request, res : Response) {
        const id = req.params.id;
        try {
            await getRepository(Score).delete(parseInt(id));
            return res.status(200).json({
                message : 'Suppression réussie'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

    static async update(req : Request, res : Response) {
        const id = req.params.id;
        const score = req.body;
        try {
            await getRepository(Score).update(id, score);
            return res.status(200).json({
                message : 'Modification réussie'
            });
        } catch (e) {
            res.status(500).json({
                message : e.message
            });
            return;
        }
    }

}