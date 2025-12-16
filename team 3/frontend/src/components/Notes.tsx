import { Card, Group, Text, Textarea } from "@mantine/core";
import { IconNote } from "@tabler/icons-react";

function Notes() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group gap="xs" mb="sm">
        <IconNote size={20} stroke={1.6} />
        <Text fw={600}>Notes</Text>
      </Group>
      <Textarea
        defaultValue="Capture quick ideas, meeting minutes, or links here."
        autosize
        minRows={3}
        variant="filled"
      />
    </Card>
  );
}

export default Notes;
