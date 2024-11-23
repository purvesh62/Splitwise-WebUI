export type Group = {
	id: number;
	members: Member[];
	name: string;
}

export interface CreatedBy {
	first_name: string;
	last_name: string;
	picture: string | null;
	email: string;
}

export interface User extends CreatedBy {
	owed_share: string;
}

export interface Member {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	picture: string | null;
	registration_status: string;
}

export interface Expense {
	category: string;
	cost: string;
	created_at: string;
	created_by: CreatedBy;
	creation_method: string;
	description: string;
	currency: string;
	id: number;
	users: User[];
}