import type { Section } from "@/lib/types";
import { backgroundConfigStyles } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";
import HeroCarouselSection from "./HeroCarouselSection";
import HeroSimpleSection from "./HeroSimpleSection";
import TextBlockSection from "./TextBlockSection";
import TwoColumnCardsSection from "./TwoColumnCardsSection";
import FeatureGridSection from "./FeatureGridSection";
import EventCardsSection from "./EventCardsSection";
import CtaCardsSection from "./CtaCardsSection";
import CtaSectionSection from "./CtaSectionSection";
import FaqAccordionSection from "./FaqAccordionSection";
import ScheduleAccordionSection from "./ScheduleAccordionSection";
import SponsorTiersSection from "./SponsorTiersSection";
import SponsorListSection from "./SponsorListSection";
import SponsorMarqueeSection from "./SponsorMarqueeSection";
import ImageCarouselSection from "./ImageCarouselSection";
import PhotoStripSection from "./PhotoStripSection";
import ImageGallerySection from "./ImageGallerySection";
import WaveDividerSection from "./WaveDividerSection";
import VehicleConvoySection from "./VehicleConvoySection";
import VehicleStreamSection from "./VehicleStreamSection";
import AccordionParentSection from "./AccordionParentSection";
import ContactFormSection from "./ContactFormSection";
import HtmlBlockSection from "./HtmlBlockSection";

interface Props {
  section: Section;
  siteStyles?: SiteStyles;
}

export default function SectionRenderer({ section, siteStyles = EMPTY_SITE_STYLES }: Props) {
  if (!section.is_visible) return null;

  const { section_type, data, settings } = section;
  const sectionId = settings.sectionId;

  const content = (() => {
    switch (section_type) {
      case "hero_carousel":
        return <HeroCarouselSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "hero_simple":
        return <HeroSimpleSection data={data} settings={settings} />;
      case "text_block":
        return <TextBlockSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "two_column_cards":
        return <TwoColumnCardsSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "feature_grid":
        return <FeatureGridSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "event_cards":
        return <EventCardsSection data={data} settings={settings} />;
      case "cta_cards":
        return <CtaCardsSection data={data} settings={settings} />;
      case "cta_section":
        return <CtaSectionSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "faq_accordion":
        return <FaqAccordionSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "schedule_accordion":
        return <ScheduleAccordionSection data={data} settings={settings} />;
      case "sponsor_tiers":
        return <SponsorTiersSection data={data} settings={settings} />;
      case "sponsor_list":
        return <SponsorListSection data={data} settings={settings} />;
      case "sponsor_marquee":
        return <SponsorMarqueeSection data={data} settings={settings} />;
      case "image_carousel":
        return <ImageCarouselSection data={data} settings={settings} />;
      case "photo_strip":
        return <PhotoStripSection data={data} settings={settings} />;
      case "image_gallery":
        return <ImageGallerySection data={data} settings={settings} />;
      case "wave_divider":
        return <WaveDividerSection data={data} settings={settings} />;
      case "vehicle_convoy":
        return <VehicleConvoySection data={data} settings={settings} />;
      case "vehicle_stream":
        return <VehicleStreamSection data={data} settings={settings} />;
      case "accordion_parent":
        return <AccordionParentSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "contact_form":
        return <ContactFormSection data={data} settings={settings} />;
      case "html_block":
        return <HtmlBlockSection data={data} />;
      default:
        return null;
    }
  })();

  if (!content) return null;

  const bgConfig = settings.bgConfig;
  const hasBg = bgConfig?.type && bgConfig.type !== "none";
  const bgStyles = hasBg ? backgroundConfigStyles(bgConfig) : undefined;
  const isImageBg = bgConfig?.type === "image" && bgConfig.imageUrl;
  const imageOpacity = (bgConfig?.imageOpacity ?? 100) / 100;

  // Wrap with background + anchor ID
  if (hasBg || sectionId) {
    return (
      <div
        id={sectionId || undefined}
        className={hasBg ? "relative overflow-hidden" : undefined}
        style={isImageBg ? undefined : bgStyles}
      >
        {isImageBg && (
          <div
            className="absolute inset-0"
            style={{ ...bgStyles, opacity: imageOpacity }}
          />
        )}
        {hasBg ? <div className="relative z-10">{content}</div> : content}
      </div>
    );
  }

  return content;
}
