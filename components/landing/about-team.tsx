import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type TeamMember = {
  initials: string;
  name: string;
  role: string;
  bio: string;
  email?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
};

const TEAM: TeamMember[] = [
  {
    initials: "MH",
    name: "Engr. Mohammad Hassan Raza",
    role: "Group Lead",
    bio: "Full Stack Developer, Orchestrating system architecture, multiple agent pipelines, and backend integration.",
    github: "https://github.com/engrhassanraza",
    linkedin: "https://www.linkedin.com/in/engrhassanrazza/",
    instagram: "https://www.instagram.com/engrhassanrazza",
  },
  {
    initials: "MA",
    name: "Muhammad Sabih Ashraf",
    role: "Team Member",
    bio: "Collaborating across the stack to build and ship core Research Copilot features.",
    email: "m.sabihashraf@gmail.com",
    github: "https://github.com/msa-ai-dev",
  },
  {
    initials: "SW",
    name: "Sooban Zaib Warraich",
    role: "Team Member",
    bio: "Collaborating across the stack to build and ship core Research Copilot features.",
    email: "soobanwarraich786@gmail.com",
    github: "https://github.com/soobanwarraich",
  },
  {
    initials: "AG",
    name: "Ahmad Gafoor",
    role: "Team Member",
    bio: "Collaborating across the stack to build and ship core Research Copilot features.",
    email: "ahmadsilver28@gmail.com",
    github: "https://github.com/ahmad-27-robin",
  },
];

export function AboutTeam() {
  return (
    <section id="team" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="accent" className="mb-4">
            THE TEAM
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Building Research Copilot
          </h2>
          <p className="mt-4 text-muted-foreground">
            Direct communication channels for the Research Copilot core team.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-5">
          {TEAM.map((member) => (
            <Card
              key={member.name}
              className="group border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/40"
            >
              <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 text-base">
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {member.role}
                    </Badge>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {member.name}
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 sm:flex-col">
                  {member.github ? (
                    <Button asChild variant="secondary" size="sm" className="justify-start gap-2">
                      <Link href={member.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                      </Link>
                    </Button>
                  ) : null}
                  {member.linkedin ? (
                    <Button asChild variant="secondary" size="sm" className="justify-start gap-2">
                      <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                      </Link>
                    </Button>
                  ) : null}
                  {member.instagram ? (
                    <Button asChild variant="secondary" size="sm" className="justify-start gap-2">
                      <Link href={member.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-3.5 w-3.5" />
                        Instagram
                      </Link>
                    </Button>
                  ) : null}
                  {member.email ? (
                    <Button asChild variant="secondary" size="sm" className="justify-start gap-2">
                      <Link href={`mailto:${member.email}`}>
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
