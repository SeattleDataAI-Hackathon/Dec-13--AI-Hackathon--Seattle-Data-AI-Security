import { Card, List, Text } from "@mantine/core";
import type { PackingSection } from "../../types/travel";

type Props = {
  section: PackingSection;
};

function PackingSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Text fw={700} mb="sm">
        {section.title ?? "Packing list"}
      </Text>
      <List size="sm" spacing="xs" c="dimmed">
        {section.items.map((item, idx) => (
          <List.Item key={`${item}-${idx}`}>{item}</List.Item>
        ))}
      </List>
    </Card>
  );
}

export default PackingSectionCard;
