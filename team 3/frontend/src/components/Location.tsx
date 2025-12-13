import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { IconMapPin, IconWorld } from "@tabler/icons-react";

function Location() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <IconMapPin size={20} stroke={1.6} />
          <Text fw={600}>Location</Text>
        </Group>
        <Badge color="teal" variant="light">
          GPS
        </Badge>
      </Group>
      <Stack gap={4}>
        <Text fw={600}>San Francisco, CA</Text>
        <Group gap="xs">
          <IconWorld size={16} stroke={1.6} />
          <Text size="sm" c="dimmed">
            37.7749° N, 122.4194° W
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

export default Location;
