import { Avatar, Badge, Card, Group, Stack, Text } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons-react";

const messages = [
  { author: "Ava", text: "Prototype is ready for review.", time: "09:12" },
  { author: "Liam", text: "Pushed the API fix to main.", time: "09:18" },
  { author: "Noah", text: "Meeting at 2pm still on?", time: "09:24" },
];

function Chat() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <IconMessageCircle2 size={20} stroke={1.6} />
          <Text fw={600}>Team chat</Text>
        </Group>
        <Badge color="indigo" variant="light">
          Live
        </Badge>
      </Group>
      <Stack gap="sm">
        {messages.map((message) => (
          <Group key={message.text} align="flex-start" gap="sm">
            <Avatar radius="xl">{message.author[0]}</Avatar>
            <div>
              <Group gap="xs">
                <Text fw={600}>{message.author}</Text>
                <Text size="xs" c="dimmed">
                  {message.time}
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {message.text}
              </Text>
            </div>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}

export default Chat;
