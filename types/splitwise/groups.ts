type Debt = {
    amount: string,
    currency_code: string,
    from: number,
    to: number
}

type SplitwiseGroup = {
    id: number,
    name: string,
    created_at: string,
    updated_at: string,
    members: SplitwiseUser[],
    simplify_by_default: boolean,
    original_debts: Debt[],
    simplified_debts: Debt[],
    whiteboard: null | string,
    group_type: null | string,
    invite_link: string,
    group_reminders: null | string,
    avatar: Avatar,
    tall_avatar: Avatar,
    custom_avatar: false,
    cover_photo: Avatar
}

type GroupExpenses = {
    id: number,
    group_id: number,
    expense_bundle_id: null,
    description: string,
    repeats: boolean,
    repeat_interval: null,
    email_reminder: boolean,
    email_reminder_in_advance: -1,
    next_repeat: null,
    details: null,
    comments_count: 0,
    payment: false,
    creation_method: string,
    transaction_method: string,
    transaction_confirmed: boolean,
    transaction_id: null,
    transaction_status: null,
    cost: string,
    currency_code: string,
    repayments?: any,
    date: string,
    created_at: string,
    created_by: SplitwiseUser,
    updated_at: string,
    updated_by: null,
    deleted_at: null,
    deleted_by: null,
    category: { id: number, name: string },
    receipt: { large: null, original: null },
    users: ExpenseUser[]
}