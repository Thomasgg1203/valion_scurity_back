export interface MgaCarrier {
  id: string;
  mgaId: string;
  carrierId: string;
  concatName: string;
  isActive: boolean;
  appetiteNotes?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
