
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
    last_name: string,
    picture?: Avatar,
    custom_picture?: boolean,
    email: string,
    registration_status?: string,
    balance?: [{ amount: string, currency_code: string }],
}

type ExpenseUser = {
    balance: {
        amount: number,
        currency_code: number
    },
    email: number,

    net_balance: string,
    owed_share: string,
    user_id: number
}
