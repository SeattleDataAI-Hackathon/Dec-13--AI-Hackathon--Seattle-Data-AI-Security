import { Card, Group, List, Stack, Text } from "@mantine/core";
import type { AccommodationSection } from "../../types/travel";

type Props = {
  section: AccommodationSection;
};

function AccommodationSection({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Group justify="space-between" mb="sm">
        <Text fw={700}>{section.title ?? "Accommodations"}</Text>
        <Text c="dimmed" size="sm">
          {section.cities.reduce((sum, city) => sum + (city.nights ?? 0), 0)} nights
        </Text>
      </Group>
      <Stack gap="sm">
        {section.cities.map((city) => (
          <Stack key={city.city ?? Math.random()} gap={4} p="sm" bg="rgba(255,255,255,0.045)" style={{ borderRadius: 12 }}>
            <Group justify="space-between">
              <Text fw={600}>{city.city ?? "Unknown city"}</Text>
              <Text size="sm" c="dimmed">
                {city.nights ?? "?"} nights
              </Text>
            </Group>
            <List size="sm" spacing={4}>
              {city.recommendations.map((rec) => (
                <List.Item key={rec}>{rec}</List.Item>
              ))}
            </List>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export default AccommodationSection;
