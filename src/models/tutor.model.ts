import {
	Table,
	Column,
	Model,
	DataType,
	HasMany,
	PrimaryKey,
	Unique,
} from 'sequelize-typescript';
import Pet from './pet.model';

@Table
export default class Tutor extends Model {
	@PrimaryKey
	@Column({
		type: DataType.UUID,
		defaultValue: DataType.UUIDV4,
	})
	tutorId!: string;
	
	@Unique
	@Column(DataType.STRING)
	email!: string;

	@Column(DataType.STRING)
	nome!: string;

	@Column(DataType.STRING)
	senha!: string;

	@HasMany(() => Pet)
	pets!: Pet[];
}
