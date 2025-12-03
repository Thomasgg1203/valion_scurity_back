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

export interface QueryResultItemDto {
  mgaCarrierId: string;
  mgaName: string;
  carrierName: string;
  appetite: AppetiteResult;
  guidelineHits: RuleHitDto[];
  stateHits: RuleHitDto[];
  exclusions: string[];
  decision: DecisionStatus;
}

export interface QueryPanelResultDto {
  items: QueryResultItemDto[];
  total: number;
}
