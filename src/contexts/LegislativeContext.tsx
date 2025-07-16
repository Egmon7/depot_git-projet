import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Bill,
  Vote,
  VoteResult,
  Notification,
  LegislativeStats,
  Deputy,
} from "@/types/legislative";
import { useAuth } from "./AuthContext";

interface LegislativeContextType {
  bills: Bill[];
  deputies: Deputy[];
  notifications: Notification[];
  stats: LegislativeStats | null;
  activePlenary: { billId: string; isActive: boolean } | null;
  proposeBill: (
    bill: Omit<
      Bill,
      "id" | "createdAt" | "updatedAt" | "authorId" | "authorName"
    >,
  ) => void;
  updateBillStatus: (billId: string, status: Bill["status"]) => void;
  validateBill: (
    billId: string,
    decision: "valider" | "declasser",
    observations?: string,
  ) => void;
  addStudyBureauAnalysis: (
    billId: string,
    analysis: Bill["studyBureauAnalysis"],
  ) => void;

  // Voting actions
  castVote: (billId: string, vote: Vote["vote"]) => void;
  startPlenary: (billId: string) => void;
  endPlenary: (billId: string) => void;

  // Notification actions
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => void;
  markNotificationRead: (notificationId: string) => void;

  // Data fetching
  getBillById: (billId: string) => Bill | undefined;
  getBillsByStatus: (status: Bill["status"]) => Bill[];
  getUserBills: (userId: string) => Bill[];
  getUnreadNotifications: () => Notification[];
}

const LegislativeContext = createContext<LegislativeContextType | undefined>(
  undefined,
);

// Mock data
const mockDeputies: Deputy[] = [
  {
    id: "2",
    firstName: "Marie",
    lastName: "Mukendi",
    email: "marie.mukendi@assemblee.cd",
    parlementaryGroup: "UDPS",
    constituency: "Funa",
    gender: "femme",
    isActive: true,
    billsProposed: 3,
    participationRate: 85,
  },
  {
    id: "6",
    firstName: "Pierre",
    lastName: "Lumumba",
    email: "pierre.lumumba@assemblee.cd",
    parlementaryGroup: "MLC",
    constituency: "Mont Amba",
    gender: "homme",
    isActive: true,
    billsProposed: 2,
    participationRate: 92,
  },
  {
    id: "7",
    firstName: "Jeanne",
    lastName: "Ebondo",
    email: "jeanne.ebondo@assemblee.cd",
    parlementaryGroup: "PPRD",
    constituency: "Lukunga",
    gender: "femme",
    isActive: true,
    billsProposed: 1,
    participationRate: 78,
  },
  {
    id: "8",
    firstName: "André",
    lastName: "Kimbuta",
    email: "andre.kimbuta@assemblee.cd",
    parlementaryGroup: "UNC",
    constituency: "Tshangu",
    gender: "homme",
    isActive: true,
    billsProposed: 4,
    participationRate: 95,
  },
];

export const LegislativeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [bills, setBills] = useState<Bill[]>([
    {
      id: "1",
      title: "Loi sur la protection de l'environnement",
      subject: "Environnement",
      motives: "Renforcer la protection de l'environnement en RDC",
      authorId: "2",
      authorName: "Marie Mukendi",
      status: "en_attente",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      title: "Loi sur l'éducation gratuite",
      subject: "Éducation",
      motives: "Garantir l'accès gratuit à l'éducation primaire",
      authorId: "6",
      authorName: "Pierre Lumumba",
      status: "en_conference",
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20"),
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      recipientId: user?.id || "",
      type: "conference",
      title: "Nouvelle convocation",
      message: "Convocation pour la conférence des présidents",
      isRead: false,
      createdAt: new Date(),
    },
  ]);

  const [activePlenary, setActivePlenary] = useState<{
    billId: string;
    isActive: boolean;
  } | null>(null);

  const deputies = mockDeputies;

  const stats: LegislativeStats = {
    totalBills: bills.length,
    billsByStatus: bills.reduce(
      (acc, bill) => {
        acc[bill.status] = (acc[bill.status] || 0) + 1;
        return acc;
      },
      {} as Record<any, number>,
    ),
    billsByConstituency: deputies.reduce(
      (acc, deputy) => {
        acc[deputy.constituency] =
          (acc[deputy.constituency] || 0) + deputy.billsProposed;
        return acc;
      },
      {} as Record<string, number>,
    ),
    billsByParlementaryGroup: deputies.reduce(
      (acc, deputy) => {
        acc[deputy.parlementaryGroup] =
          (acc[deputy.parlementaryGroup] || 0) + deputy.billsProposed;
        return acc;
      },
      {} as Record<string, number>,
    ),
    participationRates: deputies.reduce(
      (acc, deputy) => {
        acc[deputy.id] = deputy.participationRate;
        return acc;
      },
      {} as Record<string, number>,
    ),
    recentActivity: [
      {
        id: "1",
        type: "bill_proposed",
        description: "Nouvelle proposition de loi sur l'environnement",
        date: new Date("2024-01-15"),
        billId: "1",
      },
      {
        id: "2",
        type: "bill_validated",
        description: "Loi sur l'éducation validée en conférence",
        date: new Date("2024-01-20"),
        billId: "2",
      },
    ],
  };

  const proposeBill = (
    billData: Omit<
      Bill,
      "id" | "createdAt" | "updatedAt" | "authorId" | "authorName"
    >,
  ) => {
    const newBill: Bill = {
      ...billData,
      id: Date.now().toString(),
      authorId: user?.id || "",
      authorName: `${user?.firstName} ${user?.lastName}` || "",
      status: "en_attente",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBills((prev) => [...prev, newBill]);
  };

  const updateBillStatus = (billId: string, status: Bill["status"]) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId ? { ...bill, status, updatedAt: new Date() } : bill,
      ),
    );
  };

  const validateBill = (
    billId: string,
    decision: "valider" | "declasser",
    observations?: string,
  ) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              status: decision === "valider" ? "validee" : "declassee",
              conferenceDecision: {
                decision,
                date: new Date(),
                observations,
              },
              updatedAt: new Date(),
            }
          : bill,
      ),
    );
  };

  const addStudyBureauAnalysis = (
    billId: string,
    analysis: Bill["studyBureauAnalysis"],
  ) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              studyBureauAnalysis: analysis,
              status: "validee",
              updatedAt: new Date(),
            }
          : bill,
      ),
    );
  };

  const castVote = (billId: string, vote: Vote["vote"]) => {
    if (
      !user ||
      !activePlenary ||
      activePlenary.billId !== billId ||
      !activePlenary.isActive
    ) {
      return;
    }

    const newVote: Vote = {
      id: Date.now().toString(),
      billId,
      deputyId: user.id,
      deputyName: `${user.firstName} ${user.lastName}`,
      vote,
      timestamp: new Date(),
    };

    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId
          ? {
              ...bill,
              votes: [
                ...(bill.votes || []).filter((v) => v.deputyId !== user.id),
                newVote,
              ],
              updatedAt: new Date(),
            }
          : bill,
      ),
    );
  };

  const startPlenary = (billId: string) => {
    setActivePlenary({ billId, isActive: true });
    updateBillStatus(billId, "en_pleniere");
  };

  const endPlenary = (billId: string) => {
    const bill = bills.find((b) => b.id === billId);
    if (bill && bill.votes) {
      const oui = bill.votes.filter((v) => v.vote === "oui").length;
      const non = bill.votes.filter((v) => v.vote === "non").length;
      const abstention = bill.votes.filter(
        (v) => v.vote === "abstention",
      ).length;
      const totalVotes = oui + non + abstention;

      const result: VoteResult = {
        billId,
        oui,
        non,
        abstention,
        totalVotes,
        result: oui > non ? "adoptee" : "rejetee",
        date: new Date(),
      };

      setBills((prev) =>
        prev.map((b) =>
          b.id === billId
            ? {
                ...b,
                finalResult: result,
                status: result.result === "adoptee" ? "adoptee" : "rejetee",
                updatedAt: new Date(),
              }
            : b,
        ),
      );
    }

    setActivePlenary(null);
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const getBillById = (billId: string) =>
    bills.find((bill) => bill.id === billId);
  const getBillsByStatus = (status: Bill["status"]) =>
    bills.filter((bill) => bill.status === status);
  const getUserBills = (userId: string) =>
    bills.filter((bill) => bill.authorId === userId);
  const getUnreadNotifications = () =>
    notifications.filter(
      (notif) => !notif.isRead && notif.recipientId === user?.id,
    );

  return (
    <LegislativeContext.Provider
      value={{
        bills,
        deputies,
        notifications,
        stats,
        activePlenary,
        proposeBill,
        updateBillStatus,
        validateBill,
        addStudyBureauAnalysis,
        castVote,
        startPlenary,
        endPlenary,
        addNotification,
        markNotificationRead,
        getBillById,
        getBillsByStatus,
        getUserBills,
        getUnreadNotifications,
      }}
    >
      {children}
    </LegislativeContext.Provider>
  );
};

export const useLegislative = () => {
  const context = useContext(LegislativeContext);
  if (context === undefined) {
    throw new Error("useLegislative must be used within a LegislativeProvider");
  }
  return context;
};