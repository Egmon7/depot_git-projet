export interface Vote {
  id: string;
  billId: string;
  deputyId: string;
  deputyName: string;
  vote: "oui" | "non" | "abstention";
  timestamp: string;
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
