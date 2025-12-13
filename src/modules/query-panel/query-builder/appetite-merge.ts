import { AppetiteCommodityEntity } from 'src/infrastructure/database/entities/appetite-commodity.entity';
import { CommodityEntity } from 'src/infrastructure/database/entities/commodity.entity';
import { AppetiteResult, DecisionStatus } from '../types/query-result.type';

const severityOrder: DecisionStatus[] = ['ACCEPT', 'REFER', 'DECLINE'];

const resolveAppetiteStatus = (record?: AppetiteCommodityEntity): DecisionStatus => {
  if (!record) return 'REFER';

  if (record.status?.toUpperCase() === 'DECLINED') return 'DECLINE';
  if (record.status?.toUpperCase() === 'REFER') return 'REFER';

  return record.accepted ? 'ACCEPT' : 'REFER';
};

export const mergeAppetite = (
  commodities: CommodityEntity[],
  appetiteEntries: AppetiteCommodityEntity[],
): AppetiteResult => {
  if (!commodities.length) {
    return { status: 'NOT_EVALUATED', matches: [] };
  }

  let finalStatus: DecisionStatus = 'ACCEPT';
  const matches = commodities.map((commodity) => {
    const appetiteRecord = appetiteEntries.find((a) => a.commodity.id === commodity.id);
    const status = resolveAppetiteStatus(appetiteRecord);

    if (severityOrder.indexOf(status) > severityOrder.indexOf(finalStatus)) {
      finalStatus = status;
    }

    return {
      commodity: commodity.name,
      status,
      notes: appetiteRecord?.notes,
    };
  });

  return { status: finalStatus, matches };
};
