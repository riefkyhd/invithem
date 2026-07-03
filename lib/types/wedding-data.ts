import type { BankAccount, StoryMilestone, Wish } from "@/lib/types/database";

export interface WeddingEventData {
  id: string;
  label: string;
  datetime: string | null;
  time: string;
  venueName: string;
  venueAddress: string;
  mapsEmbedUrl: string;
}

export interface WeddingGuest {
  id: string;
  name: string;
  slug: string;
  eventIds: string[];
}

export interface WeddingData {
  projectId: string;
  projectSlug: string;
  couple: {
    groomName: string;
    brideName: string;
    monogram: string;
  };
  weddingDate: string;
  events: WeddingEventData[];
  parents: {
    groom: { father: string; mother: string };
    bride: { father: string; mother: string };
  };
  opening: {
    quote: string;
    greetingId: string;
    greetingEn: string;
    formalAddressId: string;
  };
  gift: {
    bankAccounts: BankAccount[];
    shippingAddress: string;
  };
  footer: {
    sustainabilityId: string;
    sustainabilityEn: string;
    credit: string;
  };
  isPasswordProtected: boolean;
  story: StoryMilestone[];
  gallery: { url: string; alt: string }[];
  livestreamUrl: string | null;
  musicUrl: string | null;
  whatsappNumber: string;
  guest: WeddingGuest | null;
  wishes: Wish[];
  share: {
    invitationUrl: string;
    messageId: string;
    messageEn: string;
  };
}

export interface CoverProps {
  data: WeddingData;
  opened: boolean;
  onOpen: () => void;
}

export interface OpeningBlockProps {
  data: WeddingData;
}

export interface GreetingProps {
  data: WeddingData;
}

export interface ParentsBlockProps {
  data: WeddingData;
}

export interface OurStoryProps {
  data: WeddingData;
}

export interface EventDetailsProps {
  data: WeddingData;
  highlightEventLabel?: string;
}

export interface CountdownProps {
  data: WeddingData;
}

export interface GalleryProps {
  data: WeddingData;
}

export interface LivestreamProps {
  data: WeddingData;
}

export interface RsvpFormProps {
  data: WeddingData;
  highlightEventLabel?: string;
}

export interface GuestBookProps {
  data: WeddingData;
}

export interface GiftEnvelopeProps {
  data: WeddingData;
}

export interface FooterProps {
  data: WeddingData;
}
