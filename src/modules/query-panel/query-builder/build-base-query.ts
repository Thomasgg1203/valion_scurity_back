import { AppetiteCommodityEntity } from 'src/infrastructure/database/entities/appetite-commodity.entity';
import { CommodityEntity } from 'src/infrastructure/database/entities/commodity.entity';
import { ExclusionEntity } from 'src/infrastructure/database/entities/exclusion.entity';
import { GuidelineRuleEntity } from 'src/infrastructure/database/entities/guideline-rule.entity';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';
import { StateEntity } from 'src/infrastructure/database/entities/state.entity';
import { StateRuleEntity } from 'src/infrastructure/database/entities/state-rule.entity';
import { IsNull, Repository } from 'typeorm';

export interface QueryDataBundle {
  carriers: MgaCarrierEntity[];
  appetite: AppetiteCommodityEntity[];
  guidelineRules: GuidelineRuleEntity[];
  stateRules: StateRuleEntity[];
  exclusions: ExclusionEntity[];
  commodities: CommodityEntity[];
  states: StateEntity[];
}

export const loadQueryData = async (repos: {
  mgaCarrierRepo: Repository<MgaCarrierEntity>;
  appetiteRepo: Repository<AppetiteCommodityEntity>;
  guidelineRuleRepo: Repository<GuidelineRuleEntity>;
  stateRuleRepo: Repository<StateRuleEntity>;
  exclusionRepo: Repository<ExclusionEntity>;
  commodityRepo: Repository<CommodityEntity>;
  stateRepo: Repository<StateEntity>;
}): Promise<QueryDataBundle> => {
  const [carriers, appetite, guidelineRules, stateRules, exclusions, commodities, states] =
    await Promise.all([
      repos.mgaCarrierRepo.find({ relations: ['mga', 'carrier'] }),
      repos.appetiteRepo.find({ relations: ['mgaCarrier', 'commodity'] }),
      repos.guidelineRuleRepo.find({ relations: ['mgaCarrier', 'field'] }),
      repos.stateRuleRepo.find({ relations: ['mgaCarrier', 'state', 'field'] }),
      repos.exclusionRepo.find({ relations: ['mgaCarrier'] }),
      repos.commodityRepo.find({ where: { deletedAt: IsNull() } }),
      repos.stateRepo.find({ where: { deletedAt: IsNull() } }),
    ]);

  return { carriers, appetite, guidelineRules, stateRules, exclusions, commodities, states };
};
