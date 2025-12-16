export interface Scenario {
  id: string;
  name: string;
  description: string;
  denialFile: string;
  notesFile: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: '1',
    name: 'Medical Necessity',
    description: 'MRI denied for insufficient conservative treatment documentation',
    denialFile: 'examples/medical-necessity/denial.txt',
    notesFile: 'examples/medical-necessity/notes.txt',
  },
  {
    id: '2',
    name: 'Coding Mismatch',
    description: 'Preventive visit incorrectly coded with diagnostic ICD-10 code',
    denialFile: 'examples/coding-mismatch/denial.txt',
    notesFile: 'examples/coding-mismatch/notes.txt',
  },
  {
    id: '3',
    name: 'Pre-Authorization',
    description: 'Surgery denied for lack of timely pre-auth (urgent clinical situation)',
    denialFile: 'examples/pre-authorization/denial.txt',
    notesFile: 'examples/pre-authorization/notes.txt',
  },
  {
    id: '4',
    name: 'Bundling/NCCI Edits',
    description: 'Colonoscopy with biopsy denied as bundled service',
    denialFile: 'examples/bundling/denial.txt',
    notesFile: 'examples/bundling/notes.txt',
  },
  {
    id: '5',
    name: 'Experimental Treatment',
    description: 'PRP injections denied as investigational/experimental',
    denialFile: 'examples/experimental/denial.txt',
    notesFile: 'examples/experimental/notes.txt',
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id || s.name.toLowerCase().includes(id.toLowerCase()));
}

export function listScenarios(): void {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                        AVAILABLE TEST SCENARIOS                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
  
  SCENARIOS.forEach((scenario) => {
    console.log(`  ${scenario.id}. ${scenario.name}`);
    console.log(`     ${scenario.description}`);
    console.log('');
  });
  
  console.log('USAGE:');
  console.log('  npm start -- --scenario <number>');
  console.log('  npm start -- --scenario 1\n');
  console.log('OR use custom files:');
  console.log('  npm start -- --denial <path> --notes <path>\n');
}
