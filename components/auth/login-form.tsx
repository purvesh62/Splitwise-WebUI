'use client'
// Hooks
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAction } from "next-safe-action/hooks"

// Types
import { LoginSchema } from "@/schema/login-schema";

// Components
import { AuthCard } from "@/components/auth/auth-card";
import { FormSuccess } from "@/components/auth/form-success";
import { FormError } from "@/components/auth/form-error";
import { emailSignIn } from "@/server/actions/signin";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LoginForm() {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const { execute, status } = useAction(emailSignIn, {
        onSuccess(data: any) {
            if (data?.success) {
                setSuccess(data.success)
            }
            if (data?.error) {
                setError(data.error)
            }
        },
        onError(data: any) {
            if (data?.error) {
                setError(data.error)
            }
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    }

    return (
        <AuthCard
            title={"Welcome back!"}
            backButtonHref={"#"}
            backButtonLabel={"Create a new account"}
            showSocialLogins={false}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email@cooldomain.com" autoComplete="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" type={"password"}
                                        autoComplete={"current-password"} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button size={"sm"} className="px-0" variant={"link"} asChild>
                        <Link href={"/auth/forgot-password"}>Forgot your password?</Link>
                    </Button>
                    <Button type="submit" className={cn(
                        "w-full my-4",
                        status === "executing" ? "animate-pulse" : "",
                    )}>
                        Login
                    </Button>
                </form>
            </Form>
        </AuthCard>)
}