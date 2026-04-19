export type Avatar = {
  small?: string;
  medium?: string;
  large?: string;
  xlarge?: string;
  xxlarge?: string;
  original?: string | null;
};

export type SplitwiseUser = {
  id: number;
  first_name: string;
  last_name: string | null;
  picture: Avatar;
  custom_picture?: boolean;
  email: string;
  registration_status?: string;
  balance: { amount: string; currency_code: string }[];
  force_refresh_at?: string;
  locale?: string;
  country_code?: string;
  date_format?: string;
  default_currency?: string;
  default_group_id?: number;
  notifications_read?: string;
  notifications_count?: number;
  notifications?: {
    added_as_friend: boolean;
    added_to_group: boolean;
    expense_added: boolean;
    expense_updated: boolean;
    bills: boolean;
    payments: boolean;
    monthly_summary: boolean;
    announcements: boolean;
  };
};

export type ExpenseUser = {
  user: SplitwiseUser;
  user_id: number;
  paid_share: string;
  owed_share: string;
  net_balance: string;
};

export type Debt = {
  amount: string;
  currency_code: string;
  from: number;
  to: number;
};

export type SplitwiseGroup = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  members: SplitwiseUser[];
  simplify_by_default: boolean;
  original_debts: Debt[];
  simplified_debts: Debt[];
  whiteboard?: null | string;
  group_type?: null | string;
  invite_link?: string;
  group_reminders?: null | string;
  avatar: Avatar;
  tall_avatar?: Avatar;
  custom_avatar?: boolean;
  cover_photo?: Avatar;
};

export type GroupExpense = {
  id: number;
  group_id: number;
  expense_bundle_id: number | null;
  description: string;
  repeats: boolean;
  repeat_interval: null;
  email_reminder: boolean;
  email_reminder_in_advance: number;
  next_repeat: null;
  details: string | null;
  comments_count: number;
  payment: boolean;
  creation_method: string | null;
  transaction_method: string;
  transaction_confirmed: boolean;
  transaction_id: null;
  transaction_status: null;
  cost: string;
  currency_code: string;
  repayments?: { from: number; to: number; amount: string }[];
  date: string;
  created_at: string;
  created_by: {
    id: number;
    first_name: string;
    last_name: string;
    picture: Avatar;
    custom_picture?: boolean;
  };
  updated_at: string;
  updated_by?: {
    id: number;
    first_name: string;
    last_name: string;
    picture: Avatar;
    custom_picture?: boolean;
  } | null;
  deleted_at: string | null;
  deleted_by: null;
  category: { id: number; name: string };
  receipt: { large: string | null; original: string | null };
  users: ExpenseUser[];
};

export type SplitwiseFriend = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  registration_status?: string;
  picture: Avatar;
  custom_picture?: boolean;
  balance?: { currency_code: string; amount: string }[];
  groups?: {
    group_id: number;
    balance: { currency_code: string; amount: string }[];
  }[];
  updated_at?: string;
};
