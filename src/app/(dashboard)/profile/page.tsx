"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services";
import { ListSkeleton } from "@/components/shared";

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => userService.getCurrentUser(),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : user ? (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="text-lg">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{user.company.department}</Badge>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue={user.firstName} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue={user.lastName} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user.email} type="email" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={user.phone} />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input defaultValue={user.username} />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input defaultValue={user.company.name} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input defaultValue={user.company.department} />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input defaultValue={user.company.title} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={user.company.address.address} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue={user.company.address.city} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input defaultValue={user.company.address.state} />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input defaultValue={user.company.address.postalCode} />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
