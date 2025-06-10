import { UserRole } from "@/types/auth";

export const permissions = {
  // Bill management
  canProposeBill: (role: UserRole): boolean => {
    return role === "depute";
  },

  canViewBillDetails: (role: UserRole): boolean => {
    return true; // All roles can view bill details
  },

  canEditBill: (
    role: UserRole,
    billAuthorId: string,
    userId: string,
  ): boolean => {
    return role === "depute" && billAuthorId === userId;
  },

  // Conference management
  canValidateBills: (role: UserRole): boolean => {
    return role === "president";
  },

  canAnalyzeBills: (role: UserRole): boolean => {
    return role === "bureau_etudes";
  },

  // Plenary management
  canStartPlenary: (role: UserRole): boolean => {
    return role === "president";
  },

  canVoteInPlenary: (role: UserRole): boolean => {
    return role === "depute";
  },

  // Convocation management
  canSendConvocations: (role: UserRole): boolean => {
    return role === "rapporteur" || role === "president";
  },

  canConvokeConference: (role: UserRole): boolean => {
    return role === "president";
  },

  canConvokeRapporteur: (role: UserRole): boolean => {
    return role === "president";
  },

  // Deputy management
  canViewDeputies: (role: UserRole): boolean => {
    return role === "president" || role === "rapporteur";
  },

  canViewStats: (role: UserRole): boolean => {
    return role === "president" || role === "conference_presidents";
  },

  // Documents
  canViewDocuments: (role: UserRole): boolean => {
    return true; // All roles can view documents
  },

  canUploadDocuments: (role: UserRole): boolean => {
    return role === "depute" || role === "bureau_etudes";
  },

  // Delegation
  canDelegateToVicePresident: (role: UserRole): boolean => {
    return role === "president";
  },
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    depute: "Député",
    president: "Président",
    rapporteur: "Rapporteur",
    bureau_etudes: "Bureau d'Études",
  };

  return roleNames[role];
};

export const getStatusDisplayName = (status: string): string => {
  const statusNames = {
    en_attente: "En attente",
    en_conference: "En conférence",
    au_bureau_etudes: "Au bureau d'études",
    validee: "Validée",
    declassee: "Déclassée",
    en_pleniere: "En plénière",
    votee: "Votée",
    adoptee: "Adoptée",
    rejetee: "Rejetée",
  };

  return statusNames[status as keyof typeof statusNames] || status;
};

export const getStatusColor = (status: string): string => {
  const statusColors = {
    en_attente: "bg-yellow-100 text-yellow-800",
    en_conference: "bg-blue-100 text-blue-800",
    au_bureau_etudes: "bg-purple-100 text-purple-800",
    validee: "bg-green-100 text-green-800",
    declassee: "bg-red-100 text-red-800",
    en_pleniere: "bg-orange-100 text-orange-800",
    votee: "bg-indigo-100 text-indigo-800",
    adoptee: "bg-emerald-100 text-emerald-800",
    rejetee: "bg-red-100 text-red-800",
  };

  return (
    statusColors[status as keyof typeof statusColors] ||
    "bg-gray-100 text-gray-800"
  );
};
