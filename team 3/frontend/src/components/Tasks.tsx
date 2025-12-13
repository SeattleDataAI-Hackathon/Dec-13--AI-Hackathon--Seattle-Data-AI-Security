import { Card, List, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

const tasks = ["Align API contract with backend", "Ship UI polish for dashboard", "Draft release notes"];

function Tasks() {
  return (
    <Card withBorder radius="md" shadow="sm">
      <Text fw={600} mb="sm">
        Tasks
      </Text>
      <List
        spacing="xs"
        size="sm"
        icon={<IconCheck size={16} stroke={1.6} color="green" />}
        styles={{ itemWrapper: { alignItems: "center" } }}
      >
        {tasks.map((task) => (
          <List.Item key={task}>{task}</List.Item>
        ))}
      </List>
    </Card>
  );
}

export default Tasks;
