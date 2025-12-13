import { Card, List, Text } from "@mantine/core";
import type { DocumentsSection } from "../../types/travel";

type Props = {
  section: DocumentsSection;
};

function DocumentsSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Text fw={700} mb="sm">
        {section.title ?? "Documents"}
      </Text>
      <List size="sm" spacing="xs" c="dimmed">
        {section.items.map((item, idx) => (
          <List.Item key={`${item}-${idx}`}>{item}</List.Item>
        ))}
      </List>
    </Card>
  );
}

export default DocumentsSectionCard;
