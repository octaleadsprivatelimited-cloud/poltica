import { z } from 'zod';

// User and Role schemas
export const RoleSchema = z.enum(['candidate', 'manager', 'member', 'viewer']);
export type Role = z.infer<typeof RoleSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().optional(),
  role: RoleSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Profile = z.infer<typeof ProfileSchema>;

// Task schemas
export const TaskStatusSchema = z.enum(['open', 'in_progress', 'paused', 'done']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: TaskStatusSchema,
  assigned_to: z.string().uuid().optional(),
  created_by: z.string().uuid(),
  due_date: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Task = z.infer<typeof TaskSchema>;

export const TaskActivitySchema = z.object({
  id: z.string().uuid(),
  task_id: z.string().uuid(),
  user_id: z.string().uuid(),
  action: z.string(),
  details: z.record(z.any()).optional(),
  created_at: z.string().datetime(),
});
export type TaskActivity = z.infer<typeof TaskActivitySchema>;

// Check-in schemas
export const CheckinTypeSchema = z.enum(['booth_visit', 'door_to_door', 'rally', 'meeting', 'other']);
export type CheckinType = z.infer<typeof CheckinTypeSchema>;

export const CheckinSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: CheckinTypeSchema,
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  notes: z.string().optional(),
  photo_url: z.string().url().optional(),
  created_at: z.string().datetime(),
});
export type Checkin = z.infer<typeof CheckinSchema>;

// Event schemas
export const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Event = z.infer<typeof EventSchema>;

export const EventRSVPSchema = z.object({
  id: z.string().uuid(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: z.enum(['going', 'not_going', 'maybe']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type EventRSVP = z.infer<typeof EventRSVPSchema>;

// Expense schemas
export const ExpenseStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type ExpenseStatus = z.infer<typeof ExpenseStatusSchema>;

export const ExpenseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().optional(),
  bill_url: z.string().url().optional(),
  status: ExpenseStatusSchema,
  approved_by: z.string().uuid().optional(),
  approved_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Expense = z.infer<typeof ExpenseSchema>;

// Audience schemas
export const AudienceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().min(10),
  ward: z.string().optional(),
  booth: z.string().optional(),
  tags: z.array(z.string()).default([]),
  whatsapp_capable: z.boolean().default(false),
  opted_out: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Audience = z.infer<typeof AudienceSchema>;

// Template schemas
export const ChannelSchema = z.enum(['whatsapp', 'sms', 'ivr']);
export type Channel = z.infer<typeof ChannelSchema>;

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  channel: ChannelSchema,
  content: z.string().min(1),
  variables: z.array(z.string()).default([]),
  approved: z.boolean().default(false),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Template = z.infer<typeof TemplateSchema>;

// Campaign schemas
export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  channel_order: z.array(ChannelSchema).default(['whatsapp', 'ivr', 'sms']),
  target_filter: z.record(z.any()).optional(),
  utm: z.record(z.string()).optional(),
  start_at: z.string().datetime().optional(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

// Dispatch schemas
export const DispatchStatusSchema = z.enum([
  'queued',
  'sent',
  'ringing',
  'delivered',
  'read',
  'failed',
  'no_answer',
  'opted_out'
]);
export type DispatchStatus = z.infer<typeof DispatchStatusSchema>;

export const DispatchSchema = z.object({
  id: z.string().uuid(),
  campaign_id: z.string().uuid(),
  audience_id: z.string().uuid(),
  current_channel: ChannelSchema,
  status: DispatchStatusSchema,
  provider_message_id: z.string().optional(),
  sent_at: z.string().datetime().optional(),
  updated_at: z.string().datetime(),
  created_at: z.string().datetime(),
});
export type Dispatch = z.infer<typeof DispatchSchema>;

// Unique link schemas
export const UniqueLinkSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  campaign_id: z.string().uuid(),
  audience_id: z.string().uuid(),
  url: z.string().url(),
  utm: z.record(z.string()).optional(),
  clicks: z.number().default(0),
  last_clicked_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
});
export type UniqueLink = z.infer<typeof UniqueLinkSchema>;

// Media asset schemas
export const MediaAssetSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1),
  url: z.string().url(),
  content_type: z.string(),
  size: z.number(),
  uploaded_by: z.string().uuid(),
  created_at: z.string().datetime(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

// Form schemas
export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().datetime().optional(),
});

export const CreateCheckinSchema = z.object({
  type: CheckinTypeSchema,
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
  notes: z.string().optional(),
  photo_url: z.string().url().optional(),
});

export const CreateEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const CreateExpenseSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().optional(),
  bill_url: z.string().url().optional(),
});

export const CreateTemplateSchema = z.object({
  name: z.string().min(1),
  channel: ChannelSchema,
  content: z.string().min(1),
  variables: z.array(z.string()).default([]),
});

export const CreateCampaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  channel_order: z.array(ChannelSchema).default(['whatsapp', 'ivr', 'sms']),
  target_filter: z.record(z.any()).optional(),
  utm: z.record(z.string()).optional(),
  start_at: z.string().datetime().optional(),
});
