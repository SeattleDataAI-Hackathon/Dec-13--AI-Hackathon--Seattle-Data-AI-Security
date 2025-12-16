import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconMicrophone, IconPlayerStop, IconWand, IconLayoutSidebarRightCollapse, IconLayoutSidebarRightExpand } from "@tabler/icons-react";
import TravelSectionRenderer from "./components/travel/TravelSectionRenderer";
import type { TravelUI } from "./types/travel";

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  item: (index: number) => SpeechRecognitionAlternativeLike;
  [index: number]: SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

const sampleTravelJson = `{
  "intent": "travel_planning",
  "trip": {
    "from": "Seattle",
    "to": "Japan",
    "duration_days": 10,
    "travelers": 1
  },
  "ui": {
    "sections": [
      {
        "type": "itinerary",
        "title": "10-Day Japan Itinerary",
        "days": [
          {
            "day": 1,
            "location": { "name": "Tokyo", "lat": 35.6762, "lng": 139.6503 },
            "activities": [
              "Arrive at Narita Airport",
              "Shinjuku walk"
            ]
          },
          {
            "day": 4,
            "location": { "name": "Kyoto", "lat": 35.0116, "lng": 135.7681 },
            "activities": [
              "Fushimi Inari",
              "Gion district"
            ]
          }
        ]
      },
      {
        "type": "flight_options",
        "title": "Suggested Flights",
        "options": [
          {
            "airline": "ANA",
            "from": "SEA",
            "to": "NRT",
            "duration": "10h 30m",
            "price_estimate": "$900-1100"
          }
        ]
      },
      {
        "type": "accommodation",
        "title": "Where to Stay",
        "cities": [
          {
            "city": "Tokyo",
            "nights": 4,
            "recommendations": ["Business hotel", "Ryokan"]
          }
        ]
      },
      {
        "type": "budget",
        "currency": "USD",
        "breakdown": {
          "flights": 1000,
          "stay": 1200,
          "food": 500,
          "local_transport": 200
        }
      },
      {
        "type": "checklist",
        "title": "Before You Go",
        "items": [
          "Passport valid for 6 months",
          "JR Pass",
          "Travel insurance"
        ]
      },
      {
        "type": "dining",
        "title": "Food to try",
        "spots": [
          { "name": "Sushi bar", "cuisine": "Seafood", "price": "$$", "address": "Shinjuku" },
          { "name": "Izakaya alley", "cuisine": "Casual", "price": "$", "address": "Omoide Yokocho" }
        ]
      },
      {
        "type": "local_tips",
        "title": "Local tips",
        "tips": [
          "Carry cash for small shops",
          "Trains are the fastest between cities",
          "Learn basic phrases: arigato, sumimasen"
        ]
      },
      {
        "type": "transport",
        "title": "Getting around",
        "passes": [
          { "name": "JR Pass", "coverage": "Nationwide trains", "price": "$250/7d" },
          { "name": "Suica", "coverage": "Metro + buses", "price": "$20 + top-up" }
        ]
      },
      {
        "type": "documents",
        "title": "Docs & visas",
        "items": ["Passport", "Visa (if needed)", "Travel insurance PDF"]
      },
      {
        "type": "packing",
        "title": "Pack this",
        "items": ["Universal adapter", "Comfortable shoes", "Light rain jacket"]
      }
    ]
  }
}`;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

function App() {
  const [jsonInput, setJsonInput] = useState(sampleTravelJson);
  const [parsed, setParsed] = useState<TravelUI | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechText, setSpeechText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [autoGeneratePending, setAutoGeneratePending] = useState(false);
  const [openedLeft, { toggle: toggleLeft }] = useDisclosure(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const ctor = getSpeechRecognitionConstructor();
    setSpeechSupported(Boolean(ctor));
  }, []);

  const handleParse = () => {
    try {
      const obj = JSON.parse(jsonInput) as TravelUI;
      setParsed(obj);
      setError(null);
    } catch (err) {
      setParsed(null);
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const sections = useMemo(() => parsed?.ui.sections ?? [], [parsed]);
  const sectionColumns = useMemo(() => {
    const colsCount = 3;
    const cols: typeof sections[] = Array.from({ length: colsCount }, () => []);
    sections.forEach((section, idx) => {
      cols[idx % colsCount].push(section);
    });
    return cols;
  }, [sections]);

  const leftSpan = openedLeft ? { base: 12, md: 4, lg: 3 } : { base: 12, md: 1, lg: 1 };
  const rightSpan = openedLeft ? { base: 12, md: 8, lg: 9 } : { base: 12, md: 11, lg: 10 };

  const startListening = () => {
    const ctor = getSpeechRecognitionConstructor();
    if (!ctor) {
      setSpeechSupported(false);
      return;
    }

    setAutoGeneratePending(false);
    const recognition = recognitionRef.current ?? new ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i += 1) {
        const result = event.results[i];
        transcript += result[0].transcript + " ";
      }
      setSpeechText(transcript.trim());
    };
    recognition.onend = () => setAutoGeneratePending(true);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setAutoGeneratePending(true);
  };

  const handleGenerateFromAI = async () => {
    if (!speechText.trim()) {
      setAiError("No transcript available. Speak or type into the transcript box first.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("http://localhost:8000/api/travel-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: speechText }),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.detail || `Request failed (${response.status})`);
      }
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      setJsonInput(jsonString);
      setParsed(data as TravelUI);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to generate from OpenAI");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!autoGeneratePending) return;
    if (aiLoading) return;
    if (!speechText.trim()) {
      setAutoGeneratePending(false);
      return;
    }
    void handleGenerateFromAI();
    setAutoGeneratePending(false);
  }, [autoGeneratePending, aiLoading, speechText]);

  return (
    <div className="page-shell">
      <Grid gutter="md" align="flex-start">
        <Grid.Col span={leftSpan}>
          <Stack gap="sm">
            <Button variant="filled" color="indigo" fullWidth onClick={toggleLeft} p="xs">
              {openedLeft ? <IconLayoutSidebarRightCollapse size={18} /> : <IconLayoutSidebarRightExpand size={18} />}
            </Button>
            {openedLeft ? (
              <Paper withBorder shadow="md" radius="md" p="md" className="glass">
                <Stack gap="md">
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Badge variant="filled" color="green">
                        Voice prompt
                      </Badge>
                      <Group gap="xs">
                        <Badge variant="light" color={speechSupported ? "green" : "red"}>
                          {speechSupported ? "Mic OK" : "Mic off"}
                        </Badge>
                        <Badge variant="light" color={listening ? "green" : "gray"}>
                          {listening ? "Listening" : "Idle"}
                        </Badge>
                      </Group>
                    </Group>
                    <Textarea
                      label="Transcript"
                      placeholder="Transcript will appear here"
                      minRows={3}
                      autosize
                      value={speechText}
                      readOnly
                      variant="filled"
                      styles={{
                        input: {
                          backgroundColor: "rgba(255,255,255,0.04)",
                          color: "#e5e7eb",
                        },
                      }}
                    />
                    <Group justify="space-between" gap="sm">
                      <Group gap="sm">
                        <Button
                          variant="light"
                          color="indigo"
                          leftSection={listening ? <IconPlayerStop size={16} /> : <IconMicrophone size={16} />}
                          onClick={listening ? stopListening : startListening}
                        >
                          {listening ? "Stop mic" : "Start mic"}
                        </Button>
                        <Button variant="subtle" color="gray" onClick={() => setSpeechText("")}>
                          Clear
                        </Button>
                      </Group>
                    </Group>
                    <Button
                      variant="filled"
                      color="green"
                      leftSection={aiLoading ? <Loader size="xs" /> : <IconWand size={16} />}
                      onClick={handleGenerateFromAI}
                      disabled={aiLoading}
                    >
                      {aiLoading ? "Generating..." : "Generate"}
                    </Button>
                    {aiError ? (
                      <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                        {aiError}
                      </Alert>
                    ) : null}
                  </Stack>

                  <Group gap="xs">
                    <Badge variant="light">itinerary</Badge>
                    <Badge variant="light">flight_options</Badge>
                    <Badge variant="light">accommodation</Badge>
                    <Badge variant="light">budget</Badge>
                    <Badge variant="light">checklist</Badge>
                  </Group>
                  <Textarea
                    label="Travel UI JSON"
                    placeholder="Generated travel_planning JSON"
                    minRows={10}
                    autosize
                    value={jsonInput}
                    onChange={(event) => setJsonInput(event.target.value)}
                    styles={{
                      input: {
                        backgroundColor: "rgba(255,255,255,0.03)",
                        color: "#e5e7eb",
                      },
                    }}
                  />
                  <Group justify="space-between" align="center">
                    <Button variant="filled" color="indigo" onClick={handleParse}>
                      Render travel UI
                    </Button>
                    <Text fw={600} c={parsed ? "green" : "dimmed"} size="sm">
                      {parsed ? "Ready" : "Waiting"}
                    </Text>
                  </Group>
                  {error ? (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                      {error}
                    </Alert>
                  ) : null}
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Grid.Col>

        <Grid.Col span={rightSpan}>
          <Stack gap="md">
            <Paper withBorder shadow="lg" radius="lg" p="lg" className="glass">
              {parsed ? (
                <Group justify="space-between">
                  <div>
                    <Text fw={700} size="lg">
                      {`${parsed.trip.from ?? "Unknown"} -> ${parsed.trip.to ?? "Unknown"}`}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {parsed.trip.duration_days ?? "?"} days | {parsed.trip.travelers ?? "?"} traveler
                      {parsed.trip.travelers && parsed.trip.travelers > 1 ? "s" : ""}
                    </Text>
                  </div>
                  <Badge color="green" variant="light">
                    {parsed.intent}
                  </Badge>
                </Group>
              ) : (
                <Text c="dimmed" size="sm">
                  Load or generate a travel_planning JSON payload to render sections.
                </Text>
              )}
            </Paper>

            <Grid gutter="md">
              {sectionColumns.map((col, colIdx) => (
                <Grid.Col key={`col-${colIdx}`} span={{ base: 12, sm: 6, lg: 4 }}>
                  <Stack gap="sm">
                    {col.map((section, index) => (
                      <TravelSectionRenderer key={`${section.type}-${colIdx}-${index}`} section={section} />
                    ))}
                  </Stack>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default App;
