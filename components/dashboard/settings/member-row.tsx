"use client";

import { Loader2, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-users";
import type { ProjectMember } from "@/types/api";

export function MemberRow({
  member,
  canManage,
  isSelf,
  onRemove,
  removing,
}: {
  member: ProjectMember;
  canManage: boolean;
  isSelf: boolean;
  onRemove: () => void;
  removing: boolean;
}) {
  const { data: user, isLoading } = useUser(member.user_id);

  if (isLoading) return <Skeleton className="h-14 w-full" />;

  return (
    <div className="glass flex items-center justify-between rounded-2xl border-border/50 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{(user?.full_name || user?.email || "?")[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user?.full_name || user?.email || "Unknown user"}
            {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>}
          </p>
          {user?.full_name && <p className="truncate text-xs text-muted-foreground">{user.email}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {member.role}
        </Badge>
        {canManage && member.role !== "owner" && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove} disabled={removing}>
            {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>
    </div>
  );
}
