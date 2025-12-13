import { Box, Card, Group, Text } from "@mantine/core";
import { IconMap2 } from "@tabler/icons-react";

function Map() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group gap="xs" mb="sm">
        <IconMap2 size={20} stroke={1.6} />
        <Text fw={600}>Map preview</Text>
      </Group>
      <Box
        h={180}
        bg="linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 35%, #7c3aed 100%)"
        style={{ borderRadius: 12, position: "relative", overflow: "hidden" }}
      >
        <Box
          pos="absolute"
          top="50%"
          left="50%"
          style={{
            transform: "translate(-50%, -50%)",
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "white",
            boxShadow: "0 0 0 10px rgba(255,255,255,0.15)",
          }}
        />
      </Box>
      <Text size="sm" c="dimmed" mt="sm">
        Replace with your preferred map provider (Leaflet, Mapbox, Google Maps, etc.).
      </Text>
    </Card>
  );
}

export default Map;
