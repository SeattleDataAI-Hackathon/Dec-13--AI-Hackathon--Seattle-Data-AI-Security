#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { AppealAgent } from './agent.js';
import { getScenarioById, listScenarios } from './scenarios.js';

// Load environment variables
config();

const program = new Command();

program
  .name('claim-crusher')
  .description('AI-powered medical billing appeal generator')
  .version('1.0.0')
  .option('-s, --scenario <number>', 'Run a test scenario (1-5)')
  .option('-d, --denial <path>', 'Path to denial letter file')
  .option('-n, --notes <path>', 'Path to clinical notes file')
  .option('-o, --output <path>', 'Output directory', 'output')
  .option('-l, --list', 'List available test scenarios')
  .parse(process.argv);

const options = program.opts();

// Handle --list flag
if (options.list) {
  listScenarios();
  process.exit(0);
}

// Handle --scenario flag
if (options.scenario) {
  const scenario = getScenarioById(options.scenario);
  if (!scenario) {
    console.error(`❌ Invalid scenario: ${options.scenario}`);
    console.log('\nUse --list to see available scenarios\n');
    process.exit(1);
  }
  options.denial = scenario.denialFile;
  options.notes = scenario.notesFile;
  console.log(`🎯 Running scenario: ${scenario.name}\n`);
}

// Validate required options
if (!options.denial || !options.notes) {
  console.error('❌ Error: Either --scenario or both --denial and --notes are required\n');
  listScenarios();
  process.exit(1);
}

async function main() {
  try {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║        AppealWriter AI - AI Appeal Generator           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Initialize agent
    const agent = new AppealAgent();

    // Generate appeal
    const result = await agent.generateAppeal(options.denial, options.notes);

    // Display results
    console.log('✅ Appeal generated successfully!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`📋 SCENARIO: ${result.scenario}`);
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log(`🚫 DENIAL REASON:\n${result.denial_reason}\n`);

    console.log('🔍 EVIDENCE FOUND:');
    result.evidence_found.forEach((evidence, index) => {
      console.log(`   ${index + 1}. ${evidence}`);
    });
    console.log('');

    // Display code validation if present
    if (result.code_validation) {
      console.log('📋 CODE VALIDATION:');
      
      if (result.code_validation.billed_codes.length > 0) {
        console.log('\n   Billed Codes:');
        result.code_validation.billed_codes.forEach((code) => {
          const statusIcon = code.status === 'correct' ? '✅' : code.status === 'incorrect' ? '❌' : '⚠️';
          console.log(`   ${statusIcon} ${code.code}: ${code.description} (${code.status})`);
        });
      }

      if (result.code_validation.suggested_codes.length > 0) {
        console.log('\n   Suggested Codes:');
        result.code_validation.suggested_codes.forEach((code) => {
          console.log(`   ✅ ${code.code}: ${code.description}`);
          console.log(`      → ${code.rationale}`);
        });
      }
      console.log('');
    }

    console.log(`💡 RECOMMENDED ACTION:\n${result.recommended_action}\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📝 APPEAL LETTER:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(result.appeal_letter);
    console.log('\n═══════════════════════════════════════════════════════════\n');

    // Save to file
    const output = `AppealWriter AI APPEAL ANALYSIS
Generated: ${new Date().toLocaleString()}

SCENARIO: ${result.scenario}

DENIAL REASON:
${result.denial_reason}

EVIDENCE FOUND:
${result.evidence_found.map((e, i) => `${i + 1}. ${e}`).join('\n')}

${result.code_validation ? `CODE VALIDATION:

Billed Codes:
${result.code_validation.billed_codes.map((c) => `${c.code}: ${c.description} (${c.status})`).join('\n')}

Suggested Codes:
${result.code_validation.suggested_codes.map((c) => `${c.code}: ${c.description}\n  Rationale: ${c.rationale}`).join('\n')}

` : ''}RECOMMENDED ACTION:
${result.recommended_action}

═══════════════════════════════════════════════════════════
APPEAL LETTER (Ready to Send):
═══════════════════════════════════════════════════════════

${result.appeal_letter}
`;

    // Generate timestamped filenames
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const appealFile = `${options.output}/appeal-${timestamp}.txt`;
    const logsFile = `${options.output}/logs-${timestamp}.txt`;

    // Save appeal
    writeFileSync(appealFile, output);
    console.log(`💾 Appeal saved to: ${appealFile}`);

    // Save logs
    const logs = agent.getLogs();
    const logsOutput = `AppealWriter AI - AGENT ACTIVITY LOGS\nGenerated: ${new Date().toLocaleString()}\n\n${'='.repeat(70)}\n\n${logs.join('\n')}\n\n${'='.repeat(70)}\n\nTotal tool calls: ${logs.filter(l => l.includes('Tool Call:')).length}\n`;
    writeFileSync(logsFile, logsOutput);
    console.log(`📋 Activity logs saved to: ${logsFile}\n`);
  } catch (error) {
    console.error('\n❌ ERROR:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
