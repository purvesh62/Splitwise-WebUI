"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { createExpense } from "@/server/actions/expenses";
import { createExpenseSchema } from "@/schemas/expense";
import { Plus } from "lucide-react";
import type { SplitwiseGroup, SplitwiseUser } from "@/types/splitwise";

function getCreateExpensePayload(
  paidBy: SplitwiseUser,
  owedBy: SplitwiseUser[],
  groupId: number,
  totalCost: number,
  description: string,
  currency = "CAD"
) {
  const isPayerInOwedBy = owedBy.some((u) => u.id === paidBy.id);
  const numberOfOwedUsers = isPayerInOwedBy ? owedBy.length : owedBy.length + 1;
  totalCost = parseFloat(totalCost.toFixed(2));
  const equalShare = parseFloat((totalCost / numberOfOwedUsers).toFixed(2));

  const users = owedBy.map((user) => ({
    user_id: user.id,
    paid_share: (user.id === paidBy.id ? totalCost : 0).toString(),
    owed_share: equalShare.toString(),
  }));

  if (!isPayerInOwedBy) {
    users.push({
      user_id: paidBy.id,
      paid_share: totalCost.toString(),
      owed_share: "0.00",
    });
  }

  const totalOwed = equalShare * numberOfOwedUsers;
  if (totalCost > totalOwed) {
    const diff = parseFloat((totalCost - totalOwed).toFixed(2));
    users[0].owed_share = (parseFloat(users[0].owed_share) + diff).toString();
  }

  return {
    amount: totalCost.toFixed(2),
    description,
    group_id: groupId,
    currency_code: currency,
    users,
    paid_by: [] as string[],
    owed_by: [] as string[],
  };
}

export function AddExpenseDrawer({ userGroup }: { userGroup: SplitwiseGroup }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [paidBy, setPaidBy] = React.useState<string[]>([]);
  const [owedBy, setOwedBy] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof createExpenseSchema>>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      amount: "",
      group_id: userGroup.id,
      description: "",
      currency_code: "CAD",
      users: [],
      paid_by: [],
      owed_by: [],
    },
  });

  const [isExecuting, setIsExecuting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof createExpenseSchema>) {
    if (paidBy.length === 0) {
      toast({
        variant: "destructive",
        title: "Select who paid",
        description: "Please select who paid for the expense.",
      });
      return;
    }
    if (owedBy.length === 0) {
      toast({
        variant: "destructive",
        title: "Select who owes",
        description: "Please select who shares the expense.",
      });
      return;
    }
    if (userGroup.id === 0) {
      toast({
        variant: "destructive",
        title: "Cannot add to non-group expenses",
      });
      return;
    }

    const payload = getCreateExpensePayload(
      userGroup.members.filter((m) => paidBy.includes(m.email))[0],
      userGroup.members.filter((m) => owedBy.includes(m.email)),
      userGroup.id,
      parseFloat(values.amount),
      values.description
    );

    setIsExecuting(true);
    try {
      const result = await createExpense(payload);
      if (result?.error) {
        toast({ variant: "destructive", title: result.error });
      } else {
        toast({ title: "Expense created successfully" });
        setOpen(false);
        setPaidBy([]);
        setOwedBy([]);
        form.reset();
      }
    } catch {
      toast({ variant: "destructive", title: "Failed to create expense" });
    } finally {
      setIsExecuting(false);
    }
  }

  const onChangePaidBy = (values: string[]) => {
    setPaidBy(values.length > 1 ? [values[values.length - 1]] : values);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Add Expense
        </Button>
      </DrawerTrigger>
      <DrawerContent className="min-h-96">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Add an Expense</DrawerTitle>
            <DrawerDescription>
              Split an expense with your group members.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="paid_by"
                  render={() => (
                    <FormItem>
                      <FormLabel>Paid By</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={paidBy}
                          onValuesChange={onChangePaidBy}
                          loop
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Who paid?" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {userGroup.members.map((member: SplitwiseUser) => (
                                <MultiSelectorItem
                                  key={member.id}
                                  value={member.email}
                                >
                                  <div className="flex items-center gap-2">
                                    <Image
                                      alt={member.first_name}
                                      className="rounded-full"
                                      width={28}
                                      height={28}
                                      src={member.picture?.medium as string}
                                    />
                                    <div>
                                      <span className="text-sm">{member.first_name}</span>
                                      <span className="ml-1 text-xs text-muted-foreground">
                                        {member.email}
                                      </span>
                                    </div>
                                  </div>
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owed_by"
                  render={() => (
                    <FormItem>
                      <FormLabel>Owed By</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={owedBy}
                          onValuesChange={setOwedBy}
                          loop
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Who shares?" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {userGroup.members.map((member: SplitwiseUser) => (
                                <MultiSelectorItem
                                  key={member.id}
                                  value={member.email}
                                >
                                  <div className="flex items-center gap-2">
                                    <Image
                                      alt={member.first_name}
                                      className="rounded-full"
                                      width={28}
                                      height={28}
                                      src={member.picture?.medium as string}
                                    />
                                    <div>
                                      <span className="text-sm">{member.first_name}</span>
                                      <span className="ml-1 text-xs text-muted-foreground">
                                        {member.email}
                                      </span>
                                    </div>
                                  </div>
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="What was it for?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DrawerFooter className="px-0 pt-4">
                  <Button type="submit" disabled={isExecuting}>
                    {isExecuting ? "Creating..." : "Create Expense"}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
