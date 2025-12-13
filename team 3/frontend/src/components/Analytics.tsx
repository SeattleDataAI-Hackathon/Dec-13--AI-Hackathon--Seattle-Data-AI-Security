import { Badge, Card, Group, Progress, Stack, Text } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

function Analytics() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <IconChartBar size={20} stroke={1.6} />
          <Text fw={600}>Analytics</Text>
        </Group>
        <Badge color="green" variant="light">
          +12% WoW
        </Badge>
      </Group>
      <Stack gap="xs">
        <Text size="sm" c="dimmed">
          Conversion
        </Text>
        <Progress value={64} color="indigo" radius="xl" />
        <Group justify="space-between">
          <Text size="sm" fw={600}>
            3.2k sessions
          </Text>
          <Text size="sm" c="dimmed">
            Target: 5k
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}

export default Analytics;
