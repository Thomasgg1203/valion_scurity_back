import { ApiProperty } from '@nestjs/swagger';
import type { DecisionStatus } from './query-result.type';

class RefDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ required: false })
  name?: string;
}

class StateRefDto {
  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  name?: string;
}

class LimitDto {
  @ApiProperty({ required: false, type: Number })
  min?: number;

  @ApiProperty({ required: false, type: Number })
  max?: number;

  @ApiProperty({ required: false })
  unit?: string;
}

class MatchedRuleSwaggerDto {
  @ApiProperty({ required: false })
  ruleId?: string;

  @ApiProperty({ enum: ['ACCEPT', 'REFER', 'DECLINE', 'LIMIT', 'EXCLUSION'] })
  type: DecisionStatus | 'LIMIT' | 'EXCLUSION';

  @ApiProperty({ enum: ['guideline', 'state_rule', 'appetite', 'exclusion'] })
  source: 'guideline' | 'state_rule' | 'appetite' | 'exclusion';

  @ApiProperty()
  description: string;
}

class RuleHitSwaggerDto {
  @ApiProperty()
  field: string;

  @ApiProperty()
  operator: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty({ enum: ['ACCEPT', 'REFER', 'DECLINE'] })
  severity: DecisionStatus;

  @ApiProperty({ required: false })
  stateCode?: string;
}

class AppetiteHitSwaggerDto {
  @ApiProperty()
  commodity: string;

  @ApiProperty({ enum: ['ACCEPT', 'REFER', 'DECLINE'] })
  status: DecisionStatus;

  @ApiProperty({ required: false })
  notes?: string;
}

class RawSwaggerDto {
  @ApiProperty({ type: [RuleHitSwaggerDto] })
  guidelineHits: RuleHitSwaggerDto[];

  @ApiProperty({ type: [RuleHitSwaggerDto] })
  stateHits: RuleHitSwaggerDto[];

  @ApiProperty({ type: [AppetiteHitSwaggerDto] })
  appetiteHits: AppetiteHitSwaggerDto[];
}

export class QueryPanelResultItemSwaggerDto {
  @ApiProperty({ type: RefDto, required: false })
  mga?: RefDto;

  @ApiProperty({ type: RefDto, required: false })
  carrier?: RefDto;

  @ApiProperty({ type: StateRefDto, required: false })
  state?: StateRefDto;

  @ApiProperty({ required: false })
  commodity_type?: string;

  @ApiProperty({ enum: ['ACCEPT', 'REFER', 'DECLINE'] })
  appetite: DecisionStatus;

  @ApiProperty({ type: [String] })
  reasons: string[];

  @ApiProperty({ type: [String] })
  exclusions: string[];

  @ApiProperty({ type: [LimitDto] })
  limits: LimitDto[];

  @ApiProperty({ type: [MatchedRuleSwaggerDto] })
  matchedRules: MatchedRuleSwaggerDto[];

  @ApiProperty({ type: RawSwaggerDto })
  raw: RawSwaggerDto;
}
