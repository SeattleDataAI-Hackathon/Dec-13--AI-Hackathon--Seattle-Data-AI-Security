import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { TransportSection } from "../../types/travel";

type Props = {
  section: TransportSection;
};

function TransportSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Group justify="space-between" mb="sm">
        <Text fw={700}>{section.title ?? "Transport & passes"}</Text>
        <Badge variant="light" color="blue">
          Transit
        </Badge>
      </Group>
      <Stack gap="sm">
        {section.passes.map((pass, idx) => (
          <Stack key={`${pass.name ?? "pass"}-${idx}`} gap={4} p="sm" bg="rgba(255,255,255,0.045)" style={{ borderRadius: 12 }}>
            <Text fw={600}>{pass.name ?? "Unknown pass"}</Text>
            <Text size="sm" c="dimmed">
              {pass.coverage ?? "Coverage unknown"}
            </Text>
            <Text size="sm" c="dimmed">
              {pass.price ?? "Price unknown"}
            </Text>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

export default TransportSectionCard;
