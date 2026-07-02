import type {
  BankAccount,
  StoryMilestone,
  Wish,
} from "@/lib/types/database";

export interface VenueBlock {
  time: string;
  name: string;
  address: string;
  mapsEmbedUrl: string;
}

export interface WeddingData {
  couple: {
    groomName: string;
    brideName: string;
    monogram: string;
  };
  weddingDate: string;
  venues: {
    ceremony: VenueBlock;
    reception: VenueBlock;
  };
  story: StoryMilestone[];
  gallery: { url: string; alt: string }[];
  bankAccounts: BankAccount[];
  livestreamUrl: string | null;
  musicUrl: string | null;
  whatsappNumber: string;
  guest: { id: string; name: string; slug: string } | null;
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

export interface GreetingProps {
  data: WeddingData;
}

export interface OurStoryProps {
  data: WeddingData;
}

export interface EventDetailsProps {
  data: WeddingData;
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
