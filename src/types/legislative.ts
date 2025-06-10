export type BillStatus =
  | "en_attente"
  | "en_conference"
  | "au_bureau_etudes"
  | "validee"
  | "declassee"
  | "en_pleniere"
  | "votee"
  | "adoptee"
  | "rejetee";

export type VoteType = "oui" | "non" | "abstention";

export type ConvocationType = "conference" | "pleniere" | "bureau_etudes";

export interface Bill {
  id: string;
  title: string;
  subject: string;
  motives: string;
  attachments?: FileAttachment[];
  authorId: string;
  authorName: string;
  status: BillStatus;
  createdAt: Date;
  updatedAt: Date;
  conferenceDecision?: {
    decision: "valider" | "declasser";
    date: Date;
    observations?: string;
  };
  studyBureauAnalysis?: {
    fundAnalysis: string;
    formAnalysis: string;
    isLegallyCorrect: boolean;
    isOriginal: boolean;
    observations: string;
    date: Date;
  };
  plenaryDate?: Date;
  votes?: Vote[];
  finalResult?: VoteResult;
}

export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Vote {
  id: string;
  billId: string;
  deputyId: string;
  deputyName: string;
  vote: VoteType;
  timestamp: Date;
}

export interface VoteResult {
  billId: string;
  oui: number;
  non: number;
  abstention: number;
  totalVotes: number;
  result: "adoptee" | "rejetee";
  date: Date;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: ConvocationType | "general";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: {
    billId?: string;
    meetingDate?: Date;
    sender?: string;
  };
}

export interface Convocation {
  id: string;
  type: ConvocationType;
  title: string;
  message: string;
  recipients: string[];
  sentBy: string;
  sentAt: Date;
  meetingDate?: Date;
  billIds?: string[];
}

export interface Deputy {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  parlementaryGroup: string;
  constituency: "Funa" | "Mont Amba" | "Lukunga" | "Tshangu";
  gender: "homme" | "femme";
  isActive: boolean;
  avatarUrl?: string;
  billsProposed: number;
  participationRate: number;
}

export interface LegislativeStats {
  totalBills: number;
  billsByStatus: Record<BillStatus, number>;
  billsByConstituency: Record<string, number>;
  billsByParlementaryGroup: Record<string, number>;
  participationRates: Record<string, number>;
  recentActivity: Array<{
    id: string;
    type:
      | "bill_proposed"
      | "bill_validated"
      | "bill_voted"
      | "plenary_scheduled";
    description: string;
    date: Date;
    billId?: string;
  }>;
}
