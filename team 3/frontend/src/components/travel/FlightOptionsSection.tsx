import { Badge, Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import type { FlightSection } from "../../types/travel";

type Props = {
  section: FlightSection;
};

function FlightOptionsSection({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Group justify="space-between" mb="sm">
        <Text fw={700}>{section.title}</Text>
        <Badge variant="light" color="indigo">
          {section.options.length} options
        </Badge>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {section.options.map((option) => (
          <Stack
            key={`${option.airline ?? "air"}-${option.from ?? "from"}-${option.to ?? "to"}-${option.duration ?? "dur"}`}
            gap={4}
            p="sm"
            bg="rgba(255,255,255,0.045)"
            style={{ borderRadius: 12 }}
          >
            <Group justify="space-between">
              <Text fw={600}>{option.airline ?? "Unknown airline"}</Text>
              <Text size="sm" c="dimmed">
                {option.duration ?? "Unknown duration"}
              </Text>
            </Group>
            <Text size="sm">
              {option.from ?? "?"} → {option.to ?? "?"}
            </Text>
            <Text size="sm" fw={600} c="indigo">
              {option.price_estimate ?? "Unknown price"}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Card>
  );
}

export default FlightOptionsSection;
