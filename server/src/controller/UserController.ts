import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../entity/User';
import { getAllUsers, getUserByCredential, getUserById, insertUser } from '../helper/userHelpers';
import jwt from 'jsonwebtoken';

export default class UserController {

    static async getAllUsers(req : Request, res : Response) {
        try {
            const users = await getAllUsers();
            return res.status(200).json({
                users
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async getUserById(req : Request, res : Response) {
        try {
            const id = req.params.id;
            const user = await getUserById(parseInt(id));
            return res.status(200).json({
                user
            });
        } catch (e) {
            return res.status(404).json({
                'message' : e.message
            });
        }
    }

    static async add(req : Request, res : Response) {
        const userEntity : User = new User();
        try {
            const existingUser = await getUserByCredential(req.body.username);
            if (existingUser) {
                res.status(400).json({
                    message : 'Pseudo existant. Utilisez un autre pseudo svp'
                });
                return;
            }

            userEntity.username = req.body.username;
            userEntity.password = bcrypt.hashSync(req.body.password, 10);
            const user = await insertUser(userEntity);
            return user;

        } catch (e) {
            console.log(e);
            res.status(500).json({
                message : e.message
            });
        }
    }

    static async login(req : Request, res : Response) {
        const {username, password} = req.body;
        try {
            const existingUser = await getUserByCredential(username);

            const user = existingUser || await UserController.add(req, res);

            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        const token = jwt.sign(
                            { userId: user.id },
                            'mysecret94652'
                        );

                        res.status(200).json({
                            user,
                            token
                        });
                        return;
                    } else {
                        res.status(403).json({
                            message : 'Mot de passe incorrect'
                        });
                        return;
                    }
                });
            } else {
                res.status(404).json({
                    message : 'pseudo incorrect'
                });
                return;
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message : e.message
            });
        }
    }

}