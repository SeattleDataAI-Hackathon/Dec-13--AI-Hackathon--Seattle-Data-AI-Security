import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { DiningSection } from "../../types/travel";

type Props = {
  section: DiningSection;
};

function DiningSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Group justify="space-between" mb="sm">
        <Text fw={700}>{section.title ?? "Dining"}</Text>
        <Badge variant="light" color="yellow">
          Food
        </Badge>
      </Group>
      <Stack gap="sm">
        {section.spots.map((spot, idx) => (
          <Stack key={`${spot.name ?? "spot"}-${idx}`} gap={2} p="sm" bg="rgba(255,255,255,0.045)" style={{ borderRadius: 12 }}>
            <Group justify="space-between">
              <Text fw={600}>{spot.name ?? "Unknown spot"}</Text>
              <Text size="sm" c="dimmed">
                {spot.price ?? "?"}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              {spot.cuisine ?? "Cuisine unknown"}
            </Text>
            <Text size="sm" c="dimmed">
              {spot.address ?? "Address unknown"}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export default DiningSectionCard;
