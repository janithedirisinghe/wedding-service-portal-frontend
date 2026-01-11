export interface SupportDTO {
  supportId?: number;
  userId: number;
  userName: string;
  userRole: string;
  topic: string;
  description: string;
  replyMessage?: string;
  severity: SupportSeverity;
  createdDate?: string;
  replyDate?: string;
}

export enum SupportSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}
