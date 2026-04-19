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
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { Separator } from "@/components/ui/separator";

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocialLogins?: boolean;
};

export const AuthCard = ({
  children,
  title,
  backButtonLabel,
  backButtonHref,
  showSocialLogins = true,
}: AuthCardProps) => {
  return (
    <Card className="w-full sm:w-96">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSocialLogins && (
          <>
            <SocialLoginButtons />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>
          </>
        )}
        {children}
      </CardContent>
      <CardFooter>
        <Button className="w-full font-medium" variant="link" asChild>
          <Link
            href={backButtonHref}
            aria-label={backButtonLabel}
            target={backButtonHref.startsWith("http") ? "_blank" : undefined}
          >
            {backButtonLabel}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
