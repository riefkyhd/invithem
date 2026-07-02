import type { AdminSettings, StoryMilestone } from "@/lib/types/database";

export const defaultStoryMilestones: StoryMilestone[] = [
  {
    year: "2019",
    title: "[FILL IN: How We Met]",
    description:
      "[FILL IN: A short editorial note about how the couple first met.]",
  },
  {
    year: "2022",
    title: "[FILL IN: The Proposal]",
    description:
      "[FILL IN: A short editorial note about the proposal moment.]",
  },
  {
    year: "2026",
    title: "[FILL IN: Our Wedding]",
    description:
      "[FILL IN: A short editorial note about the wedding celebration.]",
  },
];

export const defaultBankAccounts = [
  {
    label: "BCA",
    bank: "BCA",
    account_number: "[FILL IN: 1234567890]",
    account_name: "[FILL IN: Account Name]",
  },
];

export function mergeSettings(
  settings: AdminSettings | null
): AdminSettings {
  if (!settings) {
    return {
      id: 1,
      groom_name: "[FILL IN: Groom]",
      bride_name: "[FILL IN: Bride]",
      wedding_date: "2026-11-15T02:00:00.000Z",
      ceremony_time: "[FILL IN: 09:00 WIB]",
      ceremony_venue_name: "[FILL IN: Ceremony Venue]",
      ceremony_venue_address: "[FILL IN: Ceremony Address]",
      ceremony_maps_embed_url: "",
      reception_time: "[FILL IN: 11:00 WIB]",
      reception_venue_name: "[FILL IN: Reception Venue]",
      reception_venue_address: "[FILL IN: Reception Address]",
      reception_maps_embed_url: "",
      story_milestones: defaultStoryMilestones,
      livestream_url: "",
      bank_accounts: defaultBankAccounts,
      music_path: "",
      gallery_images: [],
      whatsapp_number: "",
      admin_emails: [],
      share_message_id:
        "Kami mengundang Anda untuk merayakan pernikahan kami.",
      share_message_en: "We invite you to celebrate our wedding.",
      updated_at: new Date().toISOString(),
    };
  }

  return {
    ...settings,
    story_milestones:
      settings.story_milestones?.length > 0
        ? settings.story_milestones
        : defaultStoryMilestones,
    bank_accounts:
      settings.bank_accounts?.length > 0
        ? settings.bank_accounts
        : defaultBankAccounts,
    gallery_images: settings.gallery_images ?? [],
  };
}
