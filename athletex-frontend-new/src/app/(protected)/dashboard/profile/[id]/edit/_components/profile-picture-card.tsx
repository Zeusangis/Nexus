import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera } from "lucide-react";

interface ProfilePictureCardProps {
  fullName: string;
}

export const ProfilePictureCard: React.FC<ProfilePictureCardProps> = ({
  fullName,
}) => {
  return (
    <Card className="rounded-2xl border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Profile Picture
        </CardTitle>
        <CardDescription>Update your profile photo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-primary/10">
            <AvatarImage src="/placeholder.svg" alt={fullName} />
            <AvatarFallback className="text-xl">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button type="button" variant="outline" size="sm">
              Upload New Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
