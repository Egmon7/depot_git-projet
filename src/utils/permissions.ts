import { UserRole } from "@/types/auth";

export const permissions = {
  canProposeBill: (role: UserRole): boolean => role === "député",
  canViewBillDetails: (role: UserRole): boolean => true,
  canEditBill: (role: UserRole, billAuthorId: string, userId: string): boolean =>
    role === "député" && billAuthorId === userId,
  canValidateBills: (role: UserRole): boolean => role === "président",
  canAnalyzeBills: (role: UserRole, direction?: string): boolean =>
    role === "Conseiller principal" || direction === "bureau_etudes",
  canStartPlenary: (role: UserRole): boolean => role === "président",
  canVoteInPlenary: (role: UserRole): boolean => role === "député",
  canSendConvocations: (role: UserRole): boolean =>
    role === "rapporteur" || role === "président",
  canConvokeConference: (role: UserRole): boolean => role === "président",
  canConvokeRapporteur: (role: UserRole): boolean => role === "président",
  canViewDeputies: (role: UserRole): boolean =>
    role === "président" || role === "rapporteur",
  canViewStats: (role: UserRole): boolean =>
    role === "président" || role === "rapporteur",
  canViewDocuments: (role: UserRole): boolean => true,
  canUploadDocuments: (role: UserRole): boolean =>
    role === "député" || role === "rapporteur",
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    député: "Député",
    président: "Président",
    rapporteur: "Rapporteur",
    "Conseiller principal" : "Conseiller principal",
   
  };
  return roleNames[role] || role;
};

export const getStatusDisplayName = (etat: number): string => {
  const statusMap: { [key: number]: string } = {
    0: "en_cabinet",
    1: "au_bureau_etudes",
    2: "en_conference",
    3: "validee",
    4: "en_pleniere",
    5: "adoptee",
    6: "rejetee",
    7: "declassee",
  };
  const status = statusMap[etat] || "inconnu";
  switch (status) {
    case "en_attente": return "En attente";
    case "en_conference": return "En conférence";
    case "au_bureau_etudes": return "Au bureau d'études";
    case "validee": return "Validée";
    case "en_pleniere": return "En plénière";
    case "adoptee": return "Adoptée";
    case "rejetee": return "Rejetée";
    case "declassee": return "Déclassée";
    default: return "Inconnu";
  }
};

export const getStatusColor = (etat: number): string => {
  const statusMap: { [key: number]: string } = {
    0: "en_cabinet",
    1: "au_bureau_etudes",
    2: "en_conference",
    3: "validee",
    4: "en_pleniere",
    5: "adoptee",
    6: "rejetee",
    7: "declassee",
  };
  const status = statusMap[etat] || "inconnu";
  switch (status) {
    case "en_cabinet": return "bg-yellow-100 text-yellow-800";
    case "en_conference": return "bg-blue-100 text-blue-800";
    case "au_bureau_etudes": return "bg-purple-100 text-purple-800";
    case "validee": return "bg-green-100 text-green-800";
    case "en_pleniere": return "bg-orange-100 text-orange-800";
    case "adoptee": return "bg-emerald-100 text-emerald-800";
    case "rejetee": return "bg-gray-600 text-white";
    case "declassee": return "bg-gray-500 text-white";
    default: return "bg-gray-100 text-gray-800";
  }
};