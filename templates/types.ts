import type { ComponentType } from "react";
import type {
  CountdownProps,
  CoverProps,
  EventDetailsProps,
  FooterProps,
  GalleryProps,
  GiftEnvelopeProps,
  GreetingProps,
  GuestBookProps,
  LivestreamProps,
  OurStoryProps,
  RsvpFormProps,
} from "@/lib/types/wedding-data";

export const TEMPLATE_SECTION_KEYS = [
  "Greeting",
  "OurStory",
  "Countdown",
  "EventDetails",
  "Gallery",
  "Livestream",
  "RsvpForm",
  "GuestBook",
  "GiftEnvelope",
  "Footer",
] as const;

export type TemplateSectionKey = (typeof TEMPLATE_SECTION_KEYS)[number];

export const DEFAULT_SECTION_ORDER: TemplateSectionKey[] = [
  ...TEMPLATE_SECTION_KEYS,
];

export interface TemplateFonts {
  className: string;
  displayClass: string;
  bodyClass: string;
}

export interface TemplateMotionVariants {
  sectionReveal: {
    initial: Record<string, number>;
    animate: Record<string, number>;
    transition: Record<string, unknown>;
  };
  coverExit: {
    transition: Record<string, unknown>;
  };
}

export interface TemplateComponents {
  Cover: ComponentType<CoverProps>;
  Greeting: ComponentType<GreetingProps>;
  OurStory: ComponentType<OurStoryProps>;
  EventDetails: ComponentType<EventDetailsProps>;
  Countdown: ComponentType<CountdownProps>;
  Gallery: ComponentType<GalleryProps>;
  Livestream: ComponentType<LivestreamProps>;
  RsvpForm: ComponentType<RsvpFormProps>;
  GuestBook: ComponentType<GuestBookProps>;
  GiftEnvelope: ComponentType<GiftEnvelopeProps>;
  Footer: ComponentType<FooterProps>;
}

export interface TemplateModule {
  fonts: TemplateFonts;
  motion: TemplateMotionVariants;
  components: TemplateComponents;
  sectionOrder?: TemplateSectionKey[];
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface TemplateDefinition extends TemplateMeta {
  load: () => Promise<TemplateModule>;
}
