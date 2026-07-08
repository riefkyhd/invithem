export type ProjectStatus = "draft" | "published" | "archived";
export type CollaboratorRole = "owner" | "editor";

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectCollaborator {
  project_id: string;
  user_id: string;
  role: CollaboratorRole;
  created_at: string;
}

export interface InvitationView {
  id: string;
  project_id: string;
  guest_id: string;
  viewed_at: string;
}

export type GuestCategory = "family" | "friends" | "VIP" | "colleagues";

export interface StoryMilestone {
  year: string;
  title: string;
  description: string;
  image_path?: string;
}

export interface BankAccount {
  label: string;
  bank: string;
  account_number: string;
  account_name: string;
}

export interface GalleryImage {
  path: string;
  alt: string;
  sort_order: number;
}

export interface WeddingEvent {
  id: string;
  project_id: string;
  label: string;
  datetime: string | null;
  venue_name: string;
  venue_address: string;
  maps_embed_url: string;
  sort_order: number;
  created_at: string;
}

export interface GuestEvent {
  guest_id: string;
  event_id: string;
}

export type TemplateId =
  | "reference"
  | "editorial-mono"
  | "dark-luxe"
  | "botanical-editorial"
  | "maximalist-bold"
  | "architectural-modern"
  | "romantic-heirloom"
  | "whimsical-pastel"
  | "monochrome-noir"
  | "silent-heritage";

export interface AdminSettings {
  project_id: string;
  template_id: TemplateId;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  ceremony_time: string;
  ceremony_venue_name: string;
  ceremony_venue_address: string;
  ceremony_maps_embed_url: string;
  reception_time: string;
  reception_venue_name: string;
  reception_venue_address: string;
  reception_maps_embed_url: string;
  groom_father_name: string;
  groom_mother_name: string;
  bride_father_name: string;
  bride_mother_name: string;
  opening_quote: string;
  opening_greeting_id: string;
  opening_greeting_en: string;
  formal_address_id: string;
  gift_shipping_address: string;
  footer_sustainability_id: string;
  footer_sustainability_en: string;
  footer_credit: string;
  is_password_protected: boolean;
  access_password_hash: string | null;
  story_milestones: StoryMilestone[];
  livestream_url: string;
  bank_accounts: BankAccount[];
  music_path: string;
  gallery_images: GalleryImage[];
  whatsapp_number: string;
  share_message_id: string;
  share_message_en: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  category: GuestCategory;
  whatsapp_number: string | null;
  created_at: string;
  event_ids?: string[];
}

export interface Rsvp {
  id: string;
  project_id: string;
  event_id: string | null;
  guest_id: string | null;
  name: string;
  attending: boolean;
  guest_count: number;
  meal_preference: string | null;
  message: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  checkin_token: string | null;
  created_at: string;
}

export interface Wish {
  id: string;
  project_id: string;
  name: string;
  message: string;
  is_hidden: boolean;
  created_at: string;
}
