import type { Section } from "../../types/travel";
import AccommodationSection from "./AccommodationSection";
import BudgetSection from "./BudgetSection";
import ChecklistSection from "./ChecklistSection";
import FlightOptionsSection from "./FlightOptionsSection";
import ItinerarySection from "./ItinerarySection";
import DiningSection from "./DiningSection";
import LocalTipsSection from "./LocalTipsSection";
import TransportSection from "./TransportSection";
import DocumentsSection from "./DocumentsSection";
import PackingSection from "./PackingSection";

type Props = {
  section: Section;
};

function TravelSectionRenderer({ section }: Props) {
  switch (section.type) {
    case "itinerary":
      return <ItinerarySection section={section} />;
    case "flight_options":
      return <FlightOptionsSection section={section} />;
    case "accommodation":
      return <AccommodationSection section={section} />;
    case "budget":
      return <BudgetSection section={section} />;
    case "checklist":
      return <ChecklistSection section={section} />;
    case "dining":
      return <DiningSection section={section} />;
    case "local_tips":
      return <LocalTipsSection section={section} />;
    case "transport":
      return <TransportSection section={section} />;
    case "documents":
      return <DocumentsSection section={section} />;
    case "packing":
      return <PackingSection section={section} />;
    default:
      return null;
  }
}

export default TravelSectionRenderer;
