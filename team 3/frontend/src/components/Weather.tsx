import { Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconCloudRain, IconSunHigh } from "@tabler/icons-react";

function Weather() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Text fw={600} mb="sm">
        Weather
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Stack gap={4} p="sm" style={{ borderRadius: 12, background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
          <Group gap="xs">
            <IconSunHigh size={20} stroke={1.6} />
            <Text fw={600}>Today</Text>
          </Group>
          <Text size="lg" fw={700}>
            24°C, Sunny
          </Text>
          <Text size="sm" c="dimmed">
            Feels like 25°C · NE 6 km/h
          </Text>
        </Stack>

        <Stack gap={4} p="sm" style={{ borderRadius: 12, background: "linear-gradient(135deg, #e0f2fe, #bfdbfe)" }}>
          <Group gap="xs">
            <IconCloudRain size={20} stroke={1.6} />
            <Text fw={600}>Tomorrow</Text>
          </Group>
          <Text size="lg" fw={700}>
            18°C, Showers
          </Text>
          <Text size="sm" c="dimmed">
            70% chance of rain · W 10 km/h
          </Text>
        </Stack>
      </SimpleGrid>
    </Card>
  );
}

export default Weather;
