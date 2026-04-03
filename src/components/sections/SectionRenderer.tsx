import type { Section, SavedNavbar } from "@/lib/types";
import { backgroundConfigStyles, buildMobileStyleBlock } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";
import Navbar from "@/components/Navbar";
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
import CustomColumnsSection from "./CustomColumnsSection";
import ContactFormSection from "./ContactFormSection";
import FormBuilderSection from "./FormBuilderSection";
import HtmlBlockSection from "./HtmlBlockSection";

interface Props {
  section: Section;
  siteStyles?: SiteStyles;
  navbars?: SavedNavbar[];
  /** When true, navbar sections render inline (relative) instead of fixed */
  embedded?: boolean;
}

function deviceVisibilityClass(dv?: string): string {
  if (dv === "desktop_only") return "hidden md:block";
  if (dv === "mobile_only") return "md:hidden";
  return "";
}

export default function SectionRenderer({ section, siteStyles = EMPTY_SITE_STYLES, navbars, embedded }: Props) {
  if (!section.is_visible) return null;

  const { section_type, data, settings } = section;
  const sectionId = settings.sectionId;
  const sectionCssId = `section-${section.id}`;
  const visClass = deviceVisibilityClass(settings.deviceVisibility);

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
      case "custom_columns":
        return <CustomColumnsSection data={data} settings={settings} siteStyles={siteStyles} />;
      case "contact_form":
        return <ContactFormSection data={data} settings={settings} />;
      case "form_builder":
        return <FormBuilderSection data={data} settings={settings} sectionId={section.id} />;
      case "html_block":
        return <HtmlBlockSection data={data} />;
      case "navbar": {
        const navbarId = (data as Record<string, unknown>)?.navbarId as string;
        const navConfig = navbars?.find((n) => n.id === navbarId)?.config;
        if (!navConfig) return null;
        return <Navbar builderConfig={navConfig} embedded={embedded} />;
      }
      default:
        return null;
    }
  })();

  if (!content) return null;

  // Navbar sections manage their own positioning (fixed, z-50) — don't wrap them
  if (section_type === "navbar") return content;

  // Mobile CSS override style block
  const mobileCSS = settings.mobileMode === "custom" ? buildMobileStyleBlock(sectionCssId, settings) : "";

  const bgConfig = settings.bgConfig;
  const hasBg = bgConfig?.type && bgConfig.type !== "none";
  const bgStyles = hasBg ? backgroundConfigStyles(bgConfig) : undefined;
  const isImageBg = bgConfig?.type === "image" && bgConfig.imageUrl;
  const imageOpacity = (bgConfig?.imageOpacity ?? 100) / 100;

  // Check if image has a non-trivial crop
  const crop = bgConfig?.imageCrop;
  const isCropped = isImageBg && crop && !(crop.x === 0 && crop.y === 0 && crop.width === 100 && crop.height === 100);
  const sizing = bgConfig?.imageSizing || "cover";

  // Map sizing option to object-fit value
  const objectFitMap: Record<string, string> = {
    cover: "cover",
    contain: "contain",
    stretch: "fill",
    tile: "cover",
    full: "cover",
  };

  // Always wrap for section ID + visibility + mobile overrides
  return (
    <div
      id={sectionCssId}
      className={[hasBg ? "relative overflow-hidden" : "", visClass].filter(Boolean).join(" ") || undefined}
      style={hasBg && !isImageBg ? bgStyles : undefined}
    >
      {mobileCSS && <style dangerouslySetInnerHTML={{ __html: mobileCSS }} />}
      {isImageBg && isCropped && crop ? (
        /* Cropped image: use <img> with object-view-box so crop + sizing both work */
        <img
          src={bgConfig.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: imageOpacity,
            objectFit: objectFitMap[sizing] as React.CSSProperties["objectFit"],
            objectViewBox: `inset(${crop.y}% ${100 - crop.x - crop.width}% ${100 - crop.y - crop.height}% ${crop.x}%)`,
          }}
        />
      ) : isImageBg ? (
        <div
          className="absolute inset-0"
          style={{ ...bgStyles, opacity: imageOpacity }}
        />
      ) : null}
      {/* Color overlay on top of bg image, behind content */}
      {isImageBg && bgConfig?.overlayColor && (bgConfig.overlayOpacity ?? 0) > 0 && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: bgConfig.overlayColor, opacity: (bgConfig.overlayOpacity ?? 0) / 100 }}
        />
      )}
      <div className={`relative z-[1] section-content`}>
        {content}
      </div>
      {/* Anchor ID for scroll-to */}
      {sectionId && sectionId !== sectionCssId && (
        <div id={sectionId} className="absolute top-0" style={{ scrollMarginTop: settings.scrollMarginTop }} />
      )}
    </div>
  );
}
