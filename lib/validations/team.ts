import { z } from "zod";

export const memberTypeEnum = z.enum(["FOUNDER", "TEAM", "MENTOR"]);

export const teamMemberSchema = z.object({
  name: z
    .string({ required_error: "Member name is required." })
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  role: z
    .string({ required_error: "Role/title is required." })
    .trim()
    .min(2, "Role must be at least 2 characters.")
    .max(100, "Role must be at most 100 characters."),
  type: memberTypeEnum.default("TEAM"),
  imageRef: z.string().trim().max(500).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const updateTeamMemberSchema = teamMemberSchema.partial().extend({
  id: z.string().uuid("Invalid member ID."),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
