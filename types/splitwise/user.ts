type Avatar = {
	small?: string,
	medium?: string,
	large?: string,
	xlarge?: string,
	xxlarge?: string,
	original?: string | null;
}

type SplitwiseUser = {
	id: number,
	first_name: string,
	last_name: string | null,
	picture: Avatar,
	custom_picture?: boolean,
	email: string,
	registration_status?: string,
	balance: [{ amount: string, currency_code: string }] | [],
	"force_refresh_at"?: string,
	"locale"?: string,
	"country_code"?: string,
	"date_format"?: string,
	"default_currency"?: string,
	"default_group_id"?: number,
	"notifications_read"?: string,
	"notifications_count"?: number,
	"notifications"?: {
		"added_as_friend": boolean,
		"added_to_group": boolean,
		"expense_added": boolean,
		"expense_updated": boolean,
		"bills": boolean,
		"payments": boolean,
		"monthly_summary": boolean,
		"announcements": boolean
	}
}

type ExpenseUser = {
	balance: {
		amount: number,
		currency_code: number
	},
	user: SplitwiseUser
	email: number,
	paid_share: string,
	net_balance: string,
	owed_share: string,
	user_id: number
}

type SplitwiseFriend = {
	id: number,
	first_name: string | null,
	last_name: string | null,
	email: string,
	registration_status?: string,
	picture: Avatar,
	custom_picture?: boolean,
	balance?: {
		"currency_code": string, "amount": string
	}[],
	groups?: {
		"group_id": number,
		"balance": [{
			"currency_code": string, "amount": string
		}] | []
	}[],
	updated_at?: string
}
