import { Request, Response } from 'express';
import TutorService from '../services/tutor.service';
import { StatusCodes } from 'http-status-codes';
import tutorService from '../services/tutor.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { hash } from 'crypto';
dotenv.config();
const secret = process.env.SECRET || ' ' ;
class TutorController {
	public async getAllTutors(req: Request, res: Response): Promise<void> {
		try {
			const Tutors = await TutorService.getAllTutors();
			res.json(Tutors);
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
	public async getTutorByPk(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const Tutor = await TutorService.getTutorByPk(id);
			res.json(Tutor);
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	public async createTutor(req: Request, res: Response): Promise<void> {
		try {
			const { nome, email, senha } = req.body;
			const salt = await bcrypt.genSalt();
			const hashSenha = await bcrypt.hash(senha, salt)
			const Tutor = await TutorService.createTutor(nome, email, hashSenha);
			res.status(StatusCodes.CREATED).json(Tutor);
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	public async removeTutorByPk(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const tutorRemoved = await TutorService.removeTutorByPk(id);
			res.status(StatusCodes.OK).json(tutorRemoved);
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Internal Server Error',
			});
		}
	}

	public async loginTutor(req:Request, res:Response): Promise<void>{
		const {email, senha} = req.body;
		const user = await tutorService.getTutorByEmail(email);
		if(!user){
			res.status(StatusCodes.NOT_FOUND).json("Email não encontrado!")
		}
		else {
			const hashSenha = user.dataValues.senha;
			console.log(hashSenha)
			if(!(await bcrypt.compare(senha, hashSenha))){
			// console.log(user.senha)
			res.status(StatusCodes.UNAUTHORIZED).json("Senha inválida!")
		}
		try{
			const token = jwt.sign({
				id: user?.id
			}, secret);
			res.status(StatusCodes.OK).json(token);
		}
		catch(err){
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Não foi possível logar!')
		}
		}
		
		
	}
}

export default new TutorController();
