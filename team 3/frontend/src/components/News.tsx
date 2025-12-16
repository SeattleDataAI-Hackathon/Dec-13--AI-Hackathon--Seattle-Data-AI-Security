import { Card, Group, Stack, Text } from "@mantine/core";
import { IconNews } from "@tabler/icons-react";

const headlines = [
  { title: "AI breaks new benchmark", source: "TechWire" },
  { title: "Design systems accelerate delivery", source: "Product Daily" },
  { title: "Startups lean into developer tooling", source: "Founders Weekly" },
];

function News() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group gap="xs" mb="sm">
        <IconNews size={20} stroke={1.6} />
        <Text fw={600}>News</Text>
      </Group>
      <Stack gap="xs">
        {headlines.map((item) => (
          <div key={item.title}>
            <Text fw={600}>{item.title}</Text>
            <Text size="sm" c="dimmed">
              {item.source}
            </Text>
          </div>
        ))}
      </Stack>
    </Card>
  );
}

export default News;
