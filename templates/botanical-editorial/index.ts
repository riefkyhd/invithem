import "./theme.css";
import { fonts } from "./fonts";
import { motion } from "./motion";
import { Cover } from "./components/Cover";
import { Greeting } from "./components/Greeting";
import { OurStory } from "./components/OurStory";
import { Countdown } from "./components/Countdown";
import { EventDetails } from "./components/EventDetails";
import { Gallery } from "./components/Gallery";
import { Livestream } from "./components/Livestream";
import { RsvpForm } from "./components/RsvpForm";
import { GuestBook } from "./components/GuestBook";
import { GiftEnvelope } from "./components/GiftEnvelope";
import { Footer } from "./components/Footer";
import type { TemplateModule } from "@/templates/types";

const templateModule: TemplateModule = {
  fonts,
  motion,
  grainIntensity: "medium",
  components: {
    Cover,
    Greeting,
    OurStory,
    EventDetails,
    Countdown,
    Gallery,
    Livestream,
    RsvpForm,
    GuestBook,
    GiftEnvelope,
    Footer,
  },
};

export default templateModule;
