export interface FindPartnersOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FindMgaCarrierOptions extends FindPartnersOptions {
  mgaId?: string;
  carrierId?: string;
  isActive?: boolean;
}
