'use client'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
export default function GroupExpensesTable({ userGroup, group }: { userGroup: GroupExpenses[], group: SplitwiseGroup }) {

    const calculateTotalAmount = () => {
        return userGroup.reduce((total, expense) => total + parseFloat(expense.cost), 0);
    };

    const totalAmount = calculateTotalAmount().toPrecision(6);

    return <Table>
        <TableCaption className="cursor-pointer">
            {group.name} group expenses
        </TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="md:min-w-[500px] sm:min-w-[200px]">Description</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {userGroup.map((expense) => (
                <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <Image className=" rounded-full" src={expense.created_by?.picture?.medium as string} alt={expense.created_by.first_name} width={30} height={30} />
                            <p> {expense.created_by.first_name} {expense.created_by.last_name}</p>

                        </div>
                    </TableCell>
                    <TableCell>{new Date(expense.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}</TableCell>
                    <TableCell className="text-right">{expense.cost}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">{totalAmount}</TableCell>
            </TableRow>
        </TableFooter>
    </Table>
}