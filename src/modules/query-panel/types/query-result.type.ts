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
  source: 'guideline' | 'state' | 'commodity' | 'appetite' | 'exclusion';
  description: string;
}

export interface QueryResultItemDto {
  mga?: { id?: string; name?: string };
  carrier?: { id?: string; name?: string };
  state?: { code?: string; name?: string };
  commodity?: { id?: string; name?: string };
  line_of_business?: { id?: string; name?: string };
  coverage?: { id?: string; name?: string };
  limit_unit?: { id?: string; code?: string; name?: string };
  appetite: DecisionStatus;
  reasons: string[];
  limits: { min?: number; max?: number; unit?: string }[];
  exclusions: string[];
  matchedRules: MatchedRuleDto[];
  raw?: any;
}

export interface QueryPanelResultDto {
  items: QueryResultItemDto[];
  total: number;
}
