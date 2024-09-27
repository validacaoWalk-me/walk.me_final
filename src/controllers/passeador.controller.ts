import { Request, Response } from 'express';
import PasseadorService from '../services/passeador.service';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config();
const secret = process.env.SECRET || ' ' ;
class PasseadorController {
	public async getAllPasseadors(req: Request, res: Response): Promise<void> {
		try {
			const Passeadors = await PasseadorService.getAllPasseadors();
			res.json(Passeadors);
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
	public async getPasseadorByPk(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		try {
			const Passeador = await PasseadorService.getPasseadorByPk(id);
			res.json(Passeador);
		} catch (error) {
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}

	public async createPasseador(req: Request, res: Response): Promise<void> {
		try {
			const { nome, email, disponibilidade, senha } = req.body;
			const salt = await bcrypt.genSalt();
			const hashSenha = await bcrypt.hash(senha, salt)
			const Passeador = await PasseadorService.createPasseador(
				nome,
				email,
				disponibilidade,
				hashSenha
			);
			res.status(StatusCodes.CREATED).json(Passeador);
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Internal Server Error',
			});
		}
	}

	public async removePasseadorByPk(
		req: Request,
		res: Response
	): Promise<void> {
		const id = req.params.id;
		try {
			const passeadorRemoved = await PasseadorService.removePasseadorByPk(
				id
			);
			res.status(StatusCodes.OK).json(passeadorRemoved);
		} catch (error) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				message: 'Internal Server Error',
			});
		}
	}

	public async loginPasseador(req:Request, res:Response): Promise<void>{
		const {email, senha} = req.body;
		const user = await PasseadorService.getPasseadorByEmail(email);
		if(!user){
			res.status(StatusCodes.NOT_FOUND).json("Email não encontrado!")
		}
		else if(!await bcrypt.compare(senha, user?.senha)){
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

export default new PasseadorController();
