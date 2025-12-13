export interface CodeValidation {
  billed_codes: Array<{
    code: string;
    description: string;
    status: 'correct' | 'incorrect' | 'questionable';
  }>;
  suggested_codes: Array<{
    code: string;
    description: string;
    rationale: string;
  }>;
}

export interface AppealResponse {
  scenario: string;
  denial_reason: string;
  evidence_found: string[];
  code_validation?: CodeValidation;
  recommended_action: string;
  appeal_letter: string;
}
