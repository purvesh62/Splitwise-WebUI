"use client"

import {Button} from "@/components/ui/button"
import {signIn} from "next-auth/react"
import {FcGoogle} from "react-icons/fc"
import {FaGithub} from "react-icons/fa"
import {AiFillGithub} from "react-icons/ai";

const socialProviders = [
	{
		id: "google",
		name: "Google",
		icon: <FcGoogle/>,
	},
	{
		id: "github",
		name: "GitHub",
		icon: <FaGithub/>,
	}
]

export default function SocialLogins() {
	return <div className={"flex flex-col gap-4"}>
		<Button
			className="flex gap-2 w-full"
			onClick={() => signIn('google', {
				redirect: false,
				callbackUrl: '/'
			})}>
			<FcGoogle size={16}/><span>Sign in with Google</span>
		</Button>
		
		<Button
			className="flex gap-2  w-full"
			onClick={() => signIn('github', {
				redirect: false,
				callbackUrl: '/'
			})}>
			<AiFillGithub size={16}/><span>Sign in with Github</span>
		</Button>
		{/*{socialProviders.map(provider => (*/}
		{/*	<Button*/}
		{/*		key={provider.id}*/}
		{/*		onClick={() => signIn(provider.id, {*/}
		{/*			redirect: false,*/}
		{/*			callbackUrl: "/",*/}
		{/*		})}*/}
		{/*		className="w-full flex gap-4 items-center justify-center"*/}
		{/*	>*/}
		{/*		{provider.icon}*/}
		{/*		<span>Sign in with {provider.name}</span>*/}
		{/*	</Button>*/}
		{/*))}*/}
	</div>
}