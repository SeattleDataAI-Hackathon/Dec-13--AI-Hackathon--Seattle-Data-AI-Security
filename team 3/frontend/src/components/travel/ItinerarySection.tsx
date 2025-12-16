import { Card, Group, Image, List, Stack, Text, Timeline } from "@mantine/core";
import type { GeoLocation, ItinerarySection } from "../../types/travel";

type Props = {
  section: ItinerarySection;
};

const googleKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function asLocation(loc: GeoLocation): { name: string; lat: number | null; lng: number | null } {
  if (!loc) return { name: "Unknown", lat: null, lng: null };
  if (typeof loc === "string") return { name: loc, lat: null, lng: null };
  return {
    name: loc.name ?? "Unknown",
    lat: loc.lat ?? null,
    lng: loc.lng ?? null,
  };
}

function mapUrl(lat: number | null, lng: number | null) {
  if (!googleKey || lat == null || lng == null) return null;
  const marker = `${lat},${lng}`;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${marker}&zoom=11&size=640x320&markers=color:red|${marker}&key=${googleKey}`;
}

function ItinerarySectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Group justify="space-between" mb="sm">
        <Text fw={700} c="#0b0b0b">
          {section.title ?? "Itinerary"}
        </Text>
        <Text c="gray" size="sm">
          {section.days.length} days
        </Text>
      </Group>
      <Timeline active={section.days.length} bulletSize={18} color="indigo">
        {section.days.map((day) => {
          const loc = asLocation(day.location);
          const url = mapUrl(loc.lat, loc.lng);
          return (
            <Timeline.Item key={`${loc.name}-${day.day ?? Math.random()}`} title={`Day ${day.day ?? "?"}: ${loc.name}`}>
              <Stack gap="xs">
                <Text size="sm" c="#d1d5db">
                  {loc.lat && loc.lng ? `Coords: ${loc.lat}, ${loc.lng}` : "Coords: unknown"}
                </Text>
                {url ? (
                  <Image
                    src={url}
                    alt={`Map of ${loc.name}`}
                    radius="md"
                    withPlaceholder
                    mah={200}
                    fit="cover"
                  />
                ) : null}
                <List size="sm" spacing={4} c="gray">
                  {day.activities.map((act) => (
                    <List.Item key={act}>{act}</List.Item>
                  ))}
                </List>
              </Stack>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Card>
  );
}

export default ItinerarySectionCard;
