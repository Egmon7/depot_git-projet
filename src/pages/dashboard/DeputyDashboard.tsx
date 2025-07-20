// frontend/src/components/dashboard/DeputyDashboard.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLegislative } from '@/contexts/LegislativeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Plus, Clock, CheckCircle, Vote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DeputyDashboard = () => {
  const { user } = useAuth();
  const { getUserBills, activePlenary, getUnreadNotifications } = useLegislative();
  const navigate = useNavigate();

  const myBills = getUserBills(user?.id || '');
  const unreadNotifications = getUnreadNotifications();

  enum BillStatus {
    en_cabinet = 0,
    au_bureau_etudes = 1,
    en_conference = 2,
    validee = 3,
    en_pleniere = 4,
    adoptee = 5,
    rejetee = 6,
    declassee = 7,
  }

  const getStatusDisplayName = (etat: number) => {
    const statusMap: { [key in BillStatus]: string } = {
      [BillStatus.en_cabinet]: 'Au cabinet du président',
      [BillStatus.en_conference]: 'En conférence',
      [BillStatus.au_bureau_etudes]: 'Au bureau d’études',
      [BillStatus.validee]: 'Validée',
      [BillStatus.en_pleniere]: 'En plénière',
      [BillStatus.adoptee]: 'Adoptée',
      [BillStatus.rejetee]: 'Rejetée',
      [BillStatus.declassee]: 'Déclassée',
    };
    return statusMap[etat] || 'Inconnu';
  };

  const getStatusColor = (etat: number) => {
    const colorMap: { [key in BillStatus]: string } = {
      [BillStatus.en_cabinet]: 'bg-yellow-500',
      [BillStatus.en_conference]: 'bg-purple-500',
      [BillStatus.au_bureau_etudes]: 'bg-orange-500',
      [BillStatus.validee]: 'bg-green-500',
      [BillStatus.en_pleniere]: 'bg-blue-500',
      [BillStatus.adoptee]: 'bg-green-600',
      [BillStatus.rejetee]: 'bg-red-500',
      [BillStatus.declassee]: 'bg-gray-500',
    };
    return colorMap[etat] || 'bg-gray-500';
  };

  const billsStats = {
    total: myBills.length,
    enAttente: myBills.filter((b) => b.etat === BillStatus.en_cabinet).length,
    validees: myBills.filter((b) => b.etat === BillStatus.validee).length,
    declassees: myBills.filter((b) => b.etat === BillStatus.declassee).length,
    votees: myBills.filter((b) => [BillStatus.adoptee, BillStatus.rejetee].includes(b.etat)).length,
  };

  const recentBills = myBills
    .sort((a, b) => new Date(b.date_depot).getTime() - new Date(a.date_depot).getTime())
    .slice(0, 5);

  const currentVotingBill = activePlenary
    ? myBills.find((b) => b.id === activePlenary.billId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Député</h1>
          <p className="text-gray-600 mt-1">Bienvenue {user?.prenom} {user?.nom}</p>
        </div>
        <Button onClick={() => navigate('/dashboard/propose-bill')}>
          <Plus className="mr-2 h-4 w-4" />
          Proposer une loi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total de mes propositions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{billsStats.total}</div>
                <p className="text-xs text-gray-600">propositions déposées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Au cabinet du président</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{billsStats.enAttente}</div>
                <p className="text-xs text-gray-600">en cours d'examen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Validées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{billsStats.validees}</div>
                <p className="text-xs text-gray-600">approuvées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">{unreadNotifications.length}</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">{unreadNotifications.length}</div>
                <p className="text-xs text-gray-600">non lues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentVotingBill && activePlenary?.isActive && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <Vote className="mr-2 h-5 w-5" />
              Vote en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentVotingBill.sujet}</h3>
                <p className="text-gray-600">{currentVotingBill.code}</p>
              </div>
              <Button
                onClick={() => navigate('/dashboard/voting')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Participer au vote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes propositions récentes</CardTitle>
            <CardDescription>Suivi de l'état de vos propositions de loi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.length > 0 ? (
                recentBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{bill.sujet}</h4>
                      <p className="text-xs text-gray-600 mt-1">{bill.code}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mise à jour: {format(new Date(bill.date_depot), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge className={getStatusColor(bill.etat)}>
                        {getStatusDisplayName(bill.etat)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune proposition pour le moment</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => navigate('/dashboard/propose-bill')}
                  >
                    Proposer votre première loi
                  </Button>
                </div>
              )}
            </div>
            {recentBills.length > 0 && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/dashboard/my-bills')}
                >
                  Voir toutes mes propositions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble</CardTitle>
            <CardDescription>Votre performance législative</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Taux de réussite</span>
                  <span>{billsStats.total > 0 ? Math.round((billsStats.validees / billsStats.total) * 100) : 0}%</span>
                </div>
                <Progress
                  value={billsStats.total > 0 ? (billsStats.validees / billsStats.total) * 100 : 0}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{billsStats.validees}</div>
                  <div className="text-sm text-green-600">Validées</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{billsStats.declassees}</div>
                  <div className="text-sm text-red-600">Déclassées</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Informations personnelles</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Groupe parlementaire:</strong> {user?.groupe_parlementaire || 'Non défini'}</p>
                  <p><strong>Circonscription:</strong> {user?.circonscription || 'Non définie'}</p>
                  <p><strong>Parti politique:</strong> {user?.partie_politique || 'Non défini'}</p>
                  <p><strong>Poste dans le parti:</strong> {user?.poste_partie || 'Non défini'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeputyDashboard;