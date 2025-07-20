// frontend/src/contexts/LegislativeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useAuth } from './AuthContext';
import { Bill, Deputy, Notification, LegislativeStats, Vote, VoteResult } from '@/types/legislative';

interface LegislativeContextType {
  bills: Bill[];
  deputies: Deputy[];
  notifications: Notification[];
  stats: LegislativeStats | null;
  activePlenary: { billId: string; isActive: boolean } | null;
  proposeBill: (
    billData: Omit<Bill, 'id' | 'date_depot' | 'id_depute' | 'author_name' | 'etat' | 'piece'> & { pieceFile?: File }
  ) => Promise<void>;
  updateBillStatus: (billId: string, etat: number) => Promise<void>;
  validateBill: (
    billId: string,
    decision: 'valider' | 'declasser',
    observations?: string
  ) => Promise<void>;
  addStudyBureauAnalysis: (
    billId: string,
    analysis: Bill['study_bureau_analysis']
  ) => Promise<void>;
  castVote: (billId: string, vote: Vote['vote']) => Promise<void>;
  startPlenary: (billId: string) => Promise<void>;
  endPlenary: (billId: string) => Promise<void>;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  getBillById: (billId: string) => Bill | undefined;
  getBillsByStatus: (etat: number) => Bill[];
  getUserBills: (userId: string) => Bill[];
  getUnreadNotifications: () => Notification[];
}

const LegislativeContext = createContext<LegislativeContextType | undefined>(undefined);

export const LegislativeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activePlenary, setActivePlenary] = useState<{ billId: string; isActive: boolean } | null>(null);
  const [stats, setStats] = useState<LegislativeStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billsResponse, deputiesResponse, notificationsResponse, plenaryResponse] = await Promise.all([
          api.get('/lois/'),
          api.get('/deputes/'),
          api.get('/notifications/'),
          api.get('/plenieres/?is_active=true'),
        ]);
        setBills(billsResponse.data);
        setDeputies(deputiesResponse.data);
        setNotifications(notificationsResponse.data);
        setActivePlenary(plenaryResponse.data.length > 0 ? plenaryResponse.data[0] : null);

        const billsByStatus = billsResponse.data.reduce(
          (acc: Record<string, number>, bill: Bill) => {
            const statusMap: { [key: number]: string } = {
              0: 'en_cabinet',
              1: 'au_bureau_etudes',
              2: 'en_conference',
              3: 'validee',
              4: 'en_pleniere',
              5: 'adoptee',
              6: 'rejetee',
              7: 'declassee',
            };
            acc[statusMap[bill.etat]] = (acc[statusMap[bill.etat]] || 0) + 1;
            return acc;
          },
          {}
        );

        const billsByConstituency = deputiesResponse.data.reduce(
          (acc: Record<string, number>, deputy: Deputy) => {
            acc[deputy.circonscription] = (acc[deputy.circonscription] || 0) + deputy.billsProposed;
            return acc;
          },
          {}
        );

        const recentActivity = billsResponse.data
          .filter((bill: Bill) => bill.etat !== 0)
          .map((bill: Bill) => ({
            id: `${bill.id}-activity`,
            type: bill.etat === 3 ? 'bill_validated' : 'bill_updated',
            description: `Loi "${bill.sujet}" ${bill.etat === 3 ? 'validée' : 'mise à jour'}`,
            date: bill.date_depot,
            billId: bill.id,
          }))
          .slice(0, 5);

        setStats({
          totalBills: billsResponse.data.length,
          billsByStatus,
          billsByConstituency,
          recentActivity,
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Erreur lors du chargement des données');
      }
    };
    fetchData();
  }, []);

  const proposeBill = async (
    billData: Omit<Bill, 'id' | 'date_depot' | 'id_depute' | 'author_name' | 'etat' | 'piece'> & {
      pieceFile?: File;
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append('sujet', billData.sujet);
      formData.append('code', billData.code);
      formData.append('exposer', billData.exposer);
      if (billData.pieceFile) {
        formData.append('piece', billData.pieceFile);
      }
  
      formData.append('id_depute', user?.id.toString() || '');
      formData.append('author_name', `${user?.prenom} ${user?.nom}`);
      formData.append('etat', '0');
  
      const response = await api.post('/lois/', formData); // ✅ Ne pas forcer le Content-Type
  
      setBills((prev) => [...prev, response.data]);
    } catch (err) {
      console.error('Erreur lors de la proposition de loi :', err);
      throw new Error('Erreur lors de la proposition de loi');
    }
  };
  

  const updateBillStatus = async (billId: string, etat: number) => {
    try {
      const response = await api.patch(`/lois/${billId}/`, { etat });
      setBills((prev) => prev.map((bill) => (bill.id === billId ? response.data : bill)));
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  };

  const validateBill = async (
    billId: string,
    decision: 'valider' | 'declasser',
    observations?: string
  ) => {
    try {
      const response = await api.patch(`/lois/${billId}/`, {
        etat: decision === 'valider' ? 3 : 7,
        conference_decision: { decision, date: new Date().toISOString(), observations },
      });
      setBills((prev) => prev.map((bill) => (bill.id === billId ? response.data : bill)));
    } catch (err) {
      throw new Error('Erreur lors de la validation de la loi');
    }
  };

  const addStudyBureauAnalysis = async (
    billId: string,
    analysis: Bill['study_bureau_analysis']
  ) => {
    try {
      const response = await api.patch(`/lois/${billId}/`, {
        study_bureau_analysis: analysis,
        etat: 3,
      });
      setBills((prev) => prev.map((bill) => (bill.id === billId ? response.data : bill)));
    } catch (err) {
      throw new Error('Erreur lors de l\'ajout de l\'analyse');
    }
  };

  const castVote = async (billId: string, vote: Vote['vote']) => {
    if (!user || !activePlenary || activePlenary.billId !== billId || !activePlenary.isActive) {
      throw new Error('Plénière non active ou utilisateur non autorisé');
    }
    try {
      const response = await api.post('/votes/', {
        billId: billId,
        deputyId: user.id,
        deputyName: `${user.prenom} ${user.nom}`,
        vote,
      });
      setBills((prev) =>
        prev.map((bill) =>
          bill.id === billId
            ? { ...bill, votes: [...(bill.votes || []).filter((v) => v.deputyId !== user.id), response.data] }
            : bill
        )
      );
    } catch (err) {
      throw new Error('Erreur lors du vote');
    }
  };

  const startPlenary = async (billId: string) => {
    try {
      const response = await api.post('/plenieres/', { billId, isActive: true });
      setActivePlenary(response.data);
      await updateBillStatus(billId, 4);
    } catch (err) {
      throw new Error('Erreur lors du démarrage de la plénière');
    }
  };

  const endPlenary = async (billId: string) => {
    try {
      const bill = bills.find((b) => b.id === billId);
      if (bill && bill.votes) {
        const oui = bill.votes.filter((v) => v.vote === 'oui').length;
        const non = bill.votes.filter((v) => v.vote === 'non').length;
        const abstention = bill.votes.filter((v) => v.vote === 'abstention').length;
        const totalVotes = oui + non + abstention;
        const result: VoteResult = {
          billId,
          nombre_oui: oui,
          nombre_non: non,
          nombre_abstention: abstention,
          nombre_total: totalVotes,
          result: oui > non ? 'adoptee' : 'rejetee',
          date: new Date().toISOString(),
        };

        await api.patch(`/lois/${billId}/`, {
          final_result: result,
          etat: result.result === 'adoptee' ? 5 : 6,
        });
        setBills((prev) =>
          prev.map((b) => (b.id === billId ? { ...b, final_result: result, etat: result.result === 'adoptee' ? 5 : 6 } : b))
        );
      }
      await api.patch(`/plenieres/${billId}/`, { isActive: false });
      setActivePlenary(null);
    } catch (err) {
      throw new Error('Erreur lors de la clôture de la plénière');
    }
  };

  const addNotification = async (
    notification: Omit<Notification, 'id' | 'createdAt'>
  ) => {
    try {
      const response = await api.post('/notifications/', {
        ...notification,
        sender: `${user?.prenom} ${user?.nom}`,
      });
      setNotifications((prev) => [response.data, ...prev]);
    } catch (err) {
      throw new Error('Erreur lors de l\'ajout de la notification');
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/`, { isRead: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour de la notification');
    }
  };

  const getBillById = (billId: string) => bills.find((bill) => bill.id === billId);
  const getBillsByStatus = (etat: number) => bills.filter((bill) => bill.etat === etat);
  const getUserBills = (userId: string) => bills.filter((bill) => bill.id_depute === userId);
  const getUnreadNotifications = () =>
    notifications.filter((notif) => !notif.isRead && notif.recipientId === user?.id);

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
    throw new Error('useLegislative must be used within a LegislativeProvider');
  }
  return context;
};