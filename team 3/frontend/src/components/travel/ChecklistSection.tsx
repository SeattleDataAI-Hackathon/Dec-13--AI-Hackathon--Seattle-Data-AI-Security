import { Card, Checkbox, Stack, Text } from "@mantine/core";
import type { ChecklistSection } from "../../types/travel";

type Props = {
  section: ChecklistSection;
};

function ChecklistSectionCard({ section }: Props) {
  return (
    <Card withBorder shadow="lg" radius="md" className="glass">
      <Text fw={700} mb="sm">
        {section.title ?? "Checklist"}
      </Text>
      <Stack gap="xs">
        {section.items.map((item) => (
          <Checkbox key={item} label={item} defaultChecked={false} />
        ))}
      </Stack>
    </Card>
  );
}

export default ChecklistSectionCard;
