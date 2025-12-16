import { Card, Group, Text } from "@mantine/core";
import { Calendar as MantineCalendar } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";

function Calendar() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group gap="xs" mb="sm">
        <IconCalendar size={20} stroke={1.6} />
        <Text fw={600}>Calendar</Text>
      </Group>
      <MantineCalendar defaultDate={new Date()} fullWidth />
    </Card>
  );
}

export default Calendar;
