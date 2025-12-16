export type TravelUI = {
  intent: "travel_planning";
  trip: {
    from: string | null;
    to: string | null;
    duration_days: number | null;
    travelers: number | null;
  };
  ui: {
    sections: Section[];
  };
};

export type GeoLocation =
  | {
      name: string | null;
      lat: number | null;
      lng: number | null;
    }
  | string
  | null;

export type Section =
  | ItinerarySection
  | FlightSection
  | AccommodationSection
  | BudgetSection
  | ChecklistSection
  | DiningSection
  | LocalTipsSection
  | TransportSection
  | DocumentsSection
  | PackingSection;

export type ItinerarySection = {
  type: "itinerary";
  title: string | null;
  days: {
    day: number | null;
    location: GeoLocation;
    activities: string[];
  }[];
};

export type FlightSection = {
  type: "flight_options";
  title: string | null;
  options: {
    airline: string | null;
    from: string | null;
    to: string | null;
    duration: string | null;
    price_estimate: string | null;
  }[];
};

export type AccommodationSection = {
  type: "accommodation";
  title: string | null;
  cities: {
    city: string | null;
    nights: number | null;
    recommendations: string[];
  }[];
};

export type BudgetSection = {
  type: "budget";
  currency: string | null;
  breakdown: Record<string, number | null>;
};

export type ChecklistSection = {
  type: "checklist";
  title: string | null;
  items: string[];
};

export type DiningSection = {
  type: "dining";
  title: string | null;
  spots: {
    name: string | null;
    cuisine: string | null;
    price: string | null;
    address: string | null;
  }[];
};

export type LocalTipsSection = {
  type: "local_tips";
  title: string | null;
  tips: string[];
};

export type TransportSection = {
  type: "transport";
  title: string | null;
  passes: {
    name: string | null;
    coverage: string | null;
    price: string | null;
  }[];
};

export type DocumentsSection = {
  type: "documents";
  title: string | null;
  items: string[];
};

export type PackingSection = {
  type: "packing";
  title: string | null;
  items: string[];
};
