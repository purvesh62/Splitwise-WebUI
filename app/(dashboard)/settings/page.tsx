import { getCurrentUser } from "@/server/queries/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/settings/theme-toggle";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {user.picture?.medium && (
                <AvatarImage src={user.picture.medium} />
              )}
              <AvatarFallback>
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Default Currency</span>
              <span className="font-medium">{user.default_currency ?? "CAD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Locale</span>
              <span className="font-medium">{user.locale ?? "en"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
