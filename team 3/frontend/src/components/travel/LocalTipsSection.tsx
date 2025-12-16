import { Card, List, Stack, Text } from "@mantine/core";
import type { LocalTipsSection } from "../../types/travel";

type Props = {
  section: LocalTipsSection;
};

function LocalTipsSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Text fw={700} mb="sm">
        {section.title ?? "Local tips"}
      </Text>
      <List size="sm" spacing="xs" c="dimmed">
        {section.tips.map((tip, idx) => (
          <List.Item key={`${tip}-${idx}`}>{tip}</List.Item>
        ))}
      </List>
    </Card>
  );
}

export default LocalTipsSectionCard;
