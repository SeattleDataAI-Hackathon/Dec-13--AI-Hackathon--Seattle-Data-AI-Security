import { Card, SimpleGrid, Stack, Text } from "@mantine/core";
import type { BudgetSection } from "../../types/travel";

type Props = {
  section: BudgetSection;
};

function BudgetSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Text fw={700} mb="sm">
        Budget ({section.currency ?? "N/A"})
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
        {Object.entries(section.breakdown).map(([category, amount]) => (
          <Stack key={category} gap={2} p="sm" bg="rgba(255,255,255,0.045)" style={{ borderRadius: 12 }}>
            <Text size="sm" c="dimmed">
              {category}
            </Text>
            <Text fw={700}>
              {section.currency ?? "?"} {amount != null ? amount.toLocaleString() : "?"}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Card>
  );
}

export default BudgetSectionCard;
