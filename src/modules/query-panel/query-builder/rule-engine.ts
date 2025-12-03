import { GuidelineRuleEntity } from 'src/infrastructure/database/entities/guideline-rule.entity';
import { StateRuleEntity } from 'src/infrastructure/database/entities/state-rule.entity';
import { NormalizedFilter, valueMatchesRule } from './apply-filters';
import { DecisionStatus, RuleHitDto } from '../types/query-result.type';

const inferSeverity = (comment?: string): DecisionStatus => {
  const text = comment?.toLowerCase() ?? '';

  if (
    text.includes('declin') ||
    text.includes('forbid') ||
    text.includes('not allowed') ||
    text.includes('not accepted')
  ) {
    return 'DECLINE';
  }

  if (text.includes('refer')) {
    return 'REFER';
  }

  return 'REFER';
};

const buildHit = (
  field: string,
  operator: string,
  value: string,
  comment: string | undefined,
  stateCode?: string,
): RuleHitDto => ({
  field,
  operator,
  value,
  comment,
  stateCode,
  severity: inferSeverity(comment),
});

const matchesStateFilter = (stateValues: string[], provided: string[]) => {
  const normalizedStates = stateValues.map((s) => s.trim().toLowerCase());
  return provided.some((val) => normalizedStates.includes(val.trim().toLowerCase()));
};

export const evaluateRules = (params: {
  filtersIndex: Map<string, NormalizedFilter[]>;
  rules: GuidelineRuleEntity[];
  stateRules: StateRuleEntity[];
  stateFilters: string[];
}): { guidelineHits: RuleHitDto[]; stateHits: RuleHitDto[] } => {
  const guidelineHits: RuleHitDto[] = [];
  const stateHits: RuleHitDto[] = [];

  for (const rule of params.rules) {
    const key = rule.field?.name;
    if (!key) continue;

    const filters = params.filtersIndex.get(key);
    if (!filters?.length) continue;

    const matched = filters.some((filter) =>
      valueMatchesRule(rule.operator as any, rule.value, filter.value),
    );
    if (matched) {
      guidelineHits.push(buildHit(key, rule.operator, rule.value, rule.comment));
    }
  }

  if (params.stateFilters.length) {
    for (const rule of params.stateRules) {
      const key = rule.field?.name;
      if (!key || !rule.state) continue;

      const stateCandidates = [rule.state.code, rule.state.id].filter(Boolean) as string[];
      if (!matchesStateFilter(stateCandidates, params.stateFilters)) continue;

      const filters = params.filtersIndex.get(key);
      if (!filters?.length) continue;

      const matched = filters.some((filter) =>
        valueMatchesRule(rule.operator as any, rule.value, filter.value),
      );
      if (matched) {
        stateHits.push(buildHit(key, rule.operator, rule.value, rule.comment, rule.state.code));
      }
    }
  }

  return { guidelineHits, stateHits };
};
