import React from "react";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SocialLogins from "@/components/auth/social-logins";


type AuthCardProps = {
	children: React.ReactNode
	title: string
	backButtonHref: string
	backButtonLabel: string
	showSocialLogins?: boolean
}

export const AuthCard = ({ children, title, backButtonLabel, backButtonHref, showSocialLogins }: AuthCardProps) => {
	return (
		<Card className="w-full sm:w-96">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{children}
			</CardContent>
			<CardFooter>
				<div className={"w-full flex flex-col gap-4"}>
					{showSocialLogins && <SocialLogins />}
					<Button className="w-full font-medium" variant={"link"}>
						<Link href={backButtonHref} aria-label={backButtonLabel} >
							{backButtonLabel}
						</Link>
					</Button>
				</div>
			</CardFooter>
		</Card>
	)
}