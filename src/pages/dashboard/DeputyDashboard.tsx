import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLegislative } from "@/contexts/LegislativeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  Vote,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DeputyDashboard = () => {
  const { user } = useAuth();
  const { getUserBills, bills, activePlenary, getUnreadNotifications } =
    useLegislative();
  const navigate = useNavigate();

  const myBills = getUserBills(user?.id || "");
  const unreadNotifications = getUnreadNotifications();

  const billsStats = {
    total: myBills.length,
    enAttente: myBills.filter((b) => b.status === "en_attente").length,
    validees: myBills.filter((b) => b.status === "validee").length,
    declassees: myBills.filter((b) => b.status === "declassee").length,
    votees: myBills.filter((b) => ["adoptee", "rejetee"].includes(b.status))
      .length,
  };

  const recentBills = myBills
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  const currentVotingBill = activePlenary
    ? bills.find((b) => b.id === activePlenary.billId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord - Député
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenue {user?.firstName} {user?.lastName}
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/propose-bill")}>
          <Plus className="mr-2 h-4 w-4" />
          Proposer une loi
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de mes propositions
            </CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">
              En attente
            </CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">
              Validées
            </CardTitle>
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
            <CardTitle className="text-sm font-medium text-gray-600">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">
                  {unreadNotifications.length}
                </span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {unreadNotifications.length}
                </div>
                <p className="text-xs text-gray-600">non lues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Voting */}
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
                <h3 className="font-semibold text-lg">
                  {currentVotingBill.title}
                </h3>
                <p className="text-gray-600">{currentVotingBill.subject}</p>
              </div>
              <Button
                onClick={() => navigate("/dashboard/voting")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Participer au vote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills */}
        <Card>
          <CardHeader>
            <CardTitle>Mes propositions récentes</CardTitle>
            <CardDescription>
              Suivi de l'état de vos propositions de loi
            </CardDescription>
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
                      <h4 className="font-medium text-sm">{bill.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {bill.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mise à jour:{" "}
                        {format(new Date(bill.updatedAt), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge className={getStatusColor(bill.status)}>
                        {getStatusDisplayName(bill.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Aucune proposition pour le moment
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => navigate("/dashboard/propose-bill")}
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
                  onClick={() => navigate("/dashboard/my-bills")}
                >
                  Voir toutes mes propositions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Overview */}
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
                  <span>
                    {billsStats.total > 0
                      ? Math.round(
                          (billsStats.validees / billsStats.total) * 100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    billsStats.total > 0
                      ? (billsStats.validees / billsStats.total) * 100
                      : 0
                  }
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {billsStats.validees}
                  </div>
                  <div className="text-sm text-green-600">Validées</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {billsStats.declassees}
                  </div>
                  <div className="text-sm text-red-600">Déclassées</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">
                  Informations personnelles
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Groupe parlementaire:</strong>{" "}
                    {user?.parlementaryGroup || "Non défini"}
                  </p>
                  <p>
                    <strong>Circonscription:</strong>{" "}
                    {user?.constituency || "Non définie"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Processus législatif
          </CardTitle>
          <CardDescription>
            Comprendre les étapes d'adoption d'une loi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm font-medium">Dépôt</div>
              <div className="text-xs text-gray-600">Proposition de loi</div>
            </div>

            <div className="hidden md:block w-8 h-0.5 bg-gray-300"></div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm font-medium">Conférence</div>
              <div className="text-xs text-gray-600">Examen initial</div>
            </div>

            <div className="hidden md:block w-8 h-0.5 bg-gray-300"></div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm font-medium">Bureau d'Études</div>
              <div className="text-xs text-gray-600">Analyse technique</div>
            </div>

            <div className="hidden md:block w-8 h-0.5 bg-gray-300"></div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Vote className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm font-medium">Plénière</div>
              <div className="text-xs text-gray-600">Vote final</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeputyDashboard;