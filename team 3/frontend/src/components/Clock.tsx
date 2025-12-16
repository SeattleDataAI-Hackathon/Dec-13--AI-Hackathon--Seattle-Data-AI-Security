import { useEffect, useState } from "react";
import { Badge, Card, Group, Text } from "@mantine/core";
import { IconClockHour4 } from "@tabler/icons-react";

function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const formatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <Card withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <IconClockHour4 size={20} stroke={1.6} />
          <Text fw={600}>Clock</Text>
        </Group>
        <Badge color="blue" variant="light">
          Live
        </Badge>
      </Group>
      <Text size="lg" fw={700}>
        {formatted}
      </Text>
      <Text size="sm" c="dimmed">
        Local device time
      </Text>
    </Card>
  );
}

export default Clock;
