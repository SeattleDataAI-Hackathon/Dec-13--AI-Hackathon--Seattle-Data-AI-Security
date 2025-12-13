#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'fs';

interface ICD10Code {
  code: string;
  description: string;
  category: string;
  clinical_context: string;
  code_type?: 'diagnosis' | 'procedure';
}

// Add code_type field to existing codes
const codes: ICD10Code[] = JSON.parse(
  readFileSync('src/icd10-database.json', 'utf-8')
);

codes.forEach((code) => {
  // All existing codes are diagnosis codes (ICD-10-CM)
  code.code_type = 'diagnosis';
});

writeFileSync('src/icd10-database.json', JSON.stringify(codes, null, 2));

console.log(`✅ Updated ${codes.length} existing codes with code_type field`);
