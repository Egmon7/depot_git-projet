// frontend/src/types/legislative.ts
// --- VOTE ---
export interface Vote {
  id: string;
  billId: string;
  deputyId: string;
  deputyName: string;
  vote: 'oui' | 'non' | 'abstention';
  timestamp: string;
}

// --- VOTE RESULT ---
export interface VoteResult {
  billId: string;
  nombre_oui: number;
  nombre_non: number;
  nombre_abstention: number;
  nombre_total: number;
  result: 'adoptee' | 'rejetee';
  date: string;
}

// --- DEPUTY ---
export interface Deputy {
  id: string;
  nom: string;
  postnom: string;
  prenom: string;
  email: string;
  sexe: 'homme' | 'femme';
  circonscription: string;
  role: 'député' | 'président' | 'rapporteur';
  partie_politique: string;
  poste_partie: string;
  direction: string;
  groupe_parlementaire: string;
  statut: boolean;
  billsProposed: number;
  participationRate: number;
}

// --- NOTIFICATION ---
export interface Notification {
  id: string;
  recipientId: string;
  type: 'conference' | 'pleniere' | 'bill_update' | 'bureau_etudes';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    sender?: string;
    meetingDate?: string;
    billId?: string;
  };
}

// --- STATS ---
export interface LegislativeStats {
  totalBills: number;
  billsByStatus: Record<string, number>;
  billsByConstituency: Record<string, number>;
  recentActivity: {
    id: string;
    type: string;
    description: string;
    date: string;
    billId?: string;
  }[];
}

// --- BILL ---
export interface Bill {
  id: string;
  sujet: string;
  code: string;
  exposer: string;
  piece?: string;
  date_depot: string;
  etat: number;
  id_depute: string;
  author_name: string;
  dateModification?: string; // Changé en string pour cohérence avec date_depot
  conference_decision?: {
    decision: 'valider' | 'declasser';
    date: string;
    titre?: string;
    observations?: string;
  };
  study_bureau_analysis?: {
    avis: 'Oui' | 'Non';
    justification: string;
    date: string;
  };
  final_result?: VoteResult;
  votes?: Vote[];
}