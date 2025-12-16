#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'fs';

interface ICD10Code {
  code: string;
  description: string;
  category: string;
  clinical_context: string;
  code_type: 'diagnosis' | 'procedure';
}

/**
 * Infer category from ICD-10-CM code prefix
 */
function inferCMCategory(code: string): string {
  const prefix = code.substring(0, 1);
  
  const categoryMap: Record<string, string> = {
    'A': 'Infectious Diseases',
    'B': 'Infectious Diseases',
    'C': 'Neoplasms',
    'D': 'Blood/Immune Disorders',
    'E': 'Endocrine/Metabolic',
    'F': 'Mental Health',
    'G': 'Neurological',
    'H': 'Eye/Ear Disorders',
    'I': 'Cardiovascular',
    'J': 'Respiratory',
    'K': 'Digestive',
    'L': 'Dermatological',
    'M': 'Musculoskeletal',
    'N': 'Genitourinary',
    'O': 'Pregnancy/Childbirth',
    'P': 'Perinatal',
    'Q': 'Congenital',
    'R': 'Symptoms',
    'S': 'Injury',
    'T': 'Injury/Complications',
    'V': 'External Causes',
    'W': 'External Causes',
    'X': 'External Causes',
    'Y': 'External Causes',
    'Z': 'Preventive Care',
  };
  
  return categoryMap[prefix] || 'Other';
}

/**
 * Infer category from ICD-10-PCS code prefix (first character = body system)
 */
function inferPCSCategory(code: string): string {
  const prefix = code.substring(0, 1);
  
  const categoryMap: Record<string, string> = {
    '0': 'Medical/Surgical',
    '1': 'Obstetrics',
    '2': 'Placement',
    '3': 'Administration',
    '4': 'Measurement/Monitoring',
    '5': 'Extracorporeal Assistance',
    '6': 'Extracorporeal Therapies',
    '7': 'Osteopathic',
    '8': 'Other Procedures',
    '9': 'Chiropractic',
    'B': 'Imaging',
    'C': 'Nuclear Medicine',
    'D': 'Radiation Therapy',
    'F': 'Physical Rehab/Diagnostic Audiology',
    'G': 'Mental Health',
    'H': 'Substance Abuse',
    'X': 'New Technology',
  };
  
  return categoryMap[prefix] || 'Other Procedures';
}

/**
 * Generate clinical context from description
 */
function generateClinicalContext(code: string, description: string, codeType: 'diagnosis' | 'procedure'): string {
  const lowerDesc = description.toLowerCase();
  
  // Add common clinical synonyms and context
  const contexts: string[] = [description.toLowerCase()];
  
  if (codeType === 'procedure') {
    // Add procedure-specific contexts
    if (lowerDesc.includes('bypass')) {
      contexts.push('surgical bypass', 'shunt', 'diversion');
    }
    if (lowerDesc.includes('replacement') || lowerDesc.includes('replace')) {
      contexts.push('joint replacement', 'implant', 'prosthesis');
    }
    if (lowerDesc.includes('removal') || lowerDesc.includes('excision')) {
      contexts.push('surgical removal', 'resection', 'extraction');
    }
    if (lowerDesc.includes('knee')) {
      contexts.push('knee surgery', 'knee procedure', 'knee operation');
    }
    if (lowerDesc.includes('shoulder')) {
      contexts.push('shoulder surgery', 'shoulder procedure', 'shoulder operation');
    }
    if (lowerDesc.includes('spine') || lowerDesc.includes('spinal')) {
      contexts.push('spinal surgery', 'back surgery', 'spine procedure');
    }
    if (lowerDesc.includes('arthroscop')) {
      contexts.push('minimally invasive', 'scope procedure', 'arthroscopy');
    }
    if (lowerDesc.includes('open approach')) {
      contexts.push('open surgery', 'open procedure');
    }
    if (lowerDesc.includes('percutaneous')) {
      contexts.push('minimally invasive', 'percutaneous procedure', 'through skin');
    }
    if (lowerDesc.includes('endoscopic')) {
      contexts.push('endoscopy', 'scope procedure', 'minimally invasive');
    }
  } else {
    // Add diagnosis-specific contexts (existing logic)
    if (lowerDesc.includes('diabetes')) {
      contexts.push('diabetic condition', 'blood sugar disorder', 'glucose metabolism');
    }
    if (lowerDesc.includes('multiple sclerosis')) {
      contexts.push('MS', 'demyelinating disease', 'autoimmune neurological disorder');
    }
    if (lowerDesc.includes('pain')) {
      contexts.push('painful condition', 'discomfort', 'ache');
    }
    if (lowerDesc.includes('inflammatory')) {
      contexts.push('inflammation', 'inflammatory condition', 'swelling');
    }
    if (lowerDesc.includes('hyperoxaluria')) {
      contexts.push('oxalate disorder', 'kidney stone risk', 'metabolic disorder');
    }
    if (lowerDesc.includes('lipodystrophy')) {
      contexts.push('fat distribution disorder', 'adipose tissue abnormality');
    }
    if (lowerDesc.includes('muscular dystrophy')) {
      contexts.push('muscle wasting', 'muscle weakness', 'progressive muscle disorder');
    }
    if (lowerDesc.includes('breast')) {
      contexts.push('mammary', 'breast tissue');
    }
    if (lowerDesc.includes('unspecified')) {
      contexts.push('not otherwise specified', 'NOS');
    }
  }
  
  if (lowerDesc.includes('right')) {
    contexts.push('right side', 'right-sided');
  }
  if (lowerDesc.includes('left')) {
    contexts.push('left side', 'left-sided');
  }
  
  return contexts.join(', ');
}

/**
 * Parse CM addenda file and extract new diagnosis codes
 */
function parseCMAddenda(filePath: string): ICD10Code[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const codes: ICD10Code[] = [];
  
  for (const line of lines) {
    if (!line.trim() || !line.startsWith('Add:')) {
      continue;
    }
    
    // Parse line format: "Add:         1 E11A    Type 2 diabetes mellitus..."
    const parts = line.split(/\s{2,}/); // Split on multiple spaces
    
    if (parts.length >= 3) {
      const code = parts[2]?.trim();
      const description = parts[3]?.trim();
      
      if (code && description) {
        codes.push({
          code: code,
          description: description,
          category: inferCMCategory(code),
          clinical_context: generateClinicalContext(code, description, 'diagnosis'),
          code_type: 'diagnosis',
        });
      }
    }
  }
  
  return codes;
}

/**
 * Parse PCS addenda file and extract new procedure codes
 */
function parsePCSAddenda(filePath: string): ICD10Code[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const codes: ICD10Code[] = [];
  
  for (const line of lines) {
    if (!line.trim() || !line.startsWith('Add:')) {
      continue;
    }
    
    // Parse line format: "Add:         00H033J Insertion of Infusion Device..."
    const parts = line.split(/\s{2,}/); // Split on multiple spaces
    
    if (parts.length >= 3) {
      const code = parts[1]?.trim();
      const shortDesc = parts[2]?.trim();
      const longDesc = parts[3]?.trim();
      
      // Use long description if available, otherwise short
      const description = longDesc || shortDesc;
      
      if (code && description) {
        codes.push({
          code: code,
          description: description,
          category: inferPCSCategory(code),
          clinical_context: generateClinicalContext(code, description, 'procedure'),
          code_type: 'procedure',
        });
      }
    }
  }
  
  return codes;
}

/**
 * Parse PCS full order file and extract common procedures (sampling)
 * For hackathon: extract every Nth code to keep database manageable
 */
function parsePCSOrderFile(filePath: string, sampleRate: number = 100): ICD10Code[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const codes: ICD10Code[] = [];
  let lineCount = 0;
  
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    
    lineCount++;
    
    // Sample every Nth line to keep database manageable
    if (lineCount % sampleRate !== 0) {
      continue;
    }
    
    // Parse line format: "00002 0016070 1 Bypass Cereb Vent to Nasophar..."
    const parts = line.split(/\s+/); // Split on whitespace
    
    if (parts.length >= 4) {
      // parts[0] = line number, parts[1] = code, parts[2] = indent level, rest = description
      const code = parts[1]?.trim();
      const descStart = 3; // Description starts at index 3
      const description = parts.slice(descStart).join(' ').trim();
      
      if (code && description && code.length === 7) {
        codes.push({
          code: code,
          description: description,
          category: inferPCSCategory(code),
          clinical_context: generateClinicalContext(code, description, 'procedure'),
          code_type: 'procedure',
        });
      }
    }
  }
  
  return codes;
}

/**
 * Main function
 */
function main() {
  console.log('📖 Parsing ICD-10-CM and ICD-10-PCS 2026 files...\n');
  
  // Parse CM addenda (diagnosis codes)
  const cmCodes = parseCMAddenda('data/icd10cm_order_addenda_2026.txt');
  console.log(`   Found ${cmCodes.length} new CM diagnosis codes\n`);
  
  // Parse PCS addenda (procedure codes)
  const pcsAddendaCodes = parsePCSAddenda('data/order_addenda_2026.txt');
  console.log(`   Found ${pcsAddendaCodes.length} new PCS procedure codes\n`);
  
  // Parse sample from full PCS order file (every 100th code for manageable size)
  console.log('   Sampling common procedures from full PCS order file...');
  const pcsCommonCodes = parsePCSOrderFile('data/icd10pcs_order_2026.txt', 100);
  console.log(`   Sampled ${pcsCommonCodes.length} common procedure codes\n`);
  
  // Combine all new codes
  const allNewCodes = [...cmCodes, ...pcsAddendaCodes, ...pcsCommonCodes];
  
  // Load existing database
  let existingCodes: ICD10Code[] = [];
  try {
    existingCodes = JSON.parse(readFileSync('src/icd10-database.json', 'utf-8'));
    // Add code_type to existing codes if missing
    existingCodes.forEach((code) => {
      if (!code.code_type) {
        code.code_type = 'diagnosis'; // All original codes are diagnosis codes
      }
    });
  } catch (error) {
    console.log('   No existing database found, creating new one');
  }
  console.log(`   Existing database has ${existingCodes.length} codes\n`);
  
  // Merge codes (avoid duplicates)
  const existingCodeSet = new Set(existingCodes.map((c) => c.code));
  const uniqueNewCodes = allNewCodes.filter((c) => !existingCodeSet.has(c.code));
  
  console.log(`   Adding ${uniqueNewCodes.length} unique new codes\n`);
  
  const mergedCodes = [...existingCodes, ...uniqueNewCodes];
  
  // Sort by code
  mergedCodes.sort((a, b) => a.code.localeCompare(b.code));
  
  // Count by type
  const diagnosisCount = mergedCodes.filter((c) => c.code_type === 'diagnosis').length;
  const procedureCount = mergedCodes.filter((c) => c.code_type === 'procedure').length;
  
  // Save expanded database
  writeFileSync('src/icd10-database.json', JSON.stringify(mergedCodes, null, 2));
  
  console.log('✅ Database updated successfully!\n');
  console.log(`   Total codes: ${mergedCodes.length}`);
  console.log(`   - Diagnosis codes (ICD-10-CM): ${diagnosisCount}`);
  console.log(`   - Procedure codes (ICD-10-PCS): ${procedureCount}`);
  console.log(`   Added: ${uniqueNewCodes.length}\n`);
  console.log('⚠️  Remember to run: npm run embed\n');
  
  // Show sample of new codes
  console.log('Sample of newly added codes:');
  uniqueNewCodes.slice(0, 10).forEach((code) => {
    console.log(`   ${code.code} - ${code.description.substring(0, 60)}... (${code.code_type})`);
  });
}

main();
