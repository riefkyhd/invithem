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

export interface AdminSettings {
  id: number;
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
  story_milestones: StoryMilestone[];
  livestream_url: string;
  bank_accounts: BankAccount[];
  music_path: string;
  gallery_images: GalleryImage[];
  whatsapp_number: string;
  admin_emails: string[];
  share_message_id: string;
  share_message_en: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  name: string;
  slug: string;
  category: GuestCategory;
  whatsapp_number: string | null;
  created_at: string;
}

export interface Rsvp {
  id: string;
  guest_id: string | null;
  name: string;
  attending: boolean;
  guest_count: number;
  meal_preference: string | null;
  message: string | null;
  created_at: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  is_hidden: boolean;
  created_at: string;
}
