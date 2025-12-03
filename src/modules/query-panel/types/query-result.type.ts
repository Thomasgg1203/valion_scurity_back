export type DecisionStatus = 'ACCEPT' | 'REFER' | 'DECLINE';

export interface RuleHitDto {
  field: string;
  operator: string;
  value: string;
  comment?: string;
  severity: DecisionStatus;
  stateCode?: string;
}

export interface AppetiteHitDto {
  commodity: string;
  status: DecisionStatus;
  notes?: string;
}

export interface AppetiteResult {
  status: DecisionStatus | 'NOT_EVALUATED';
  matches: AppetiteHitDto[];
}

export interface MatchedRuleDto {
  ruleId?: string;
  type: DecisionStatus | 'LIMIT' | 'EXCLUSION';
  source: 'guideline' | 'state_rule' | 'appetite' | 'exclusion';
  description: string;
}

export interface QueryResultItemDto {
  mga?: { id?: string; name?: string };
  carrier?: { id?: string; name?: string };
  state?: { code?: string; name?: string };
  commodity_type?: string;
  appetite: DecisionStatus;
  reasons: string[];
  limits: { min?: number; max?: number; unit?: string }[];
  exclusions: string[];
  matchedRules: MatchedRuleDto[];
  raw?: {
    guidelineHits: RuleHitDto[];
    stateHits: RuleHitDto[];
    appetiteHits: AppetiteResult['matches'];
  };
}

export type QueryPanelResultDto = QueryResultItemDto[];
