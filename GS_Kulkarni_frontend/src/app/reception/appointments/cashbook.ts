export interface Cashbook {
    date: string | number | Date;
    id?: number;  // Optional for new entries
    entry_date: string;  // yyyy-MM-dd
    entry_time: string;  // HH:mm
    description: string;
    transaction_type: 'INCOME' | 'EXPENSE';
    amount: number;
    payment_mode: 'CASH' | 'CARD' | 'ONLINE' | 'CHEQUE' | 'UPI';
    reference_no?: string;
    created_by: number;
}
