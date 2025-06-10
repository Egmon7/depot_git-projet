import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  BarChart3,
  Calendar,
  FileText,
  MessageSquare,
  UserPlus,
  Vote,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PresidentDashboard = () => {
  const { user } = useAuth();
  const {
    bills,
    deputies,
    stats,
    activePlenary,
    startPlenary,
    endPlenary,
    addNotification,
  } = useLegislative();
  const navigate = useNavigate();

  const [convocationDialog, setConvocationDialog] = useState(false);
  const [convocationData, setConvocationData] = useState({
    title: "",
    message: "",
    type: "conference" as "conference" | "pleniere",
    meetingDate: "",
  });

  const handleSendConvocation = () => {
    // Send notification to rapporteur
    addNotification({
      recipientId: "3", // Rapporteur ID
      type: convocationData.type,
      title: convocationData.title,
      message: convocationData.message,
      isRead: false,
      metadata: {
        meetingDate: new Date(convocationData.meetingDate),
        sender: `${user?.firstName} ${user?.lastName}`,
      },
    });

    setConvocationDialog(false);
    setConvocationData({
      title: "",
      message: "",
      type: "conference",
      meetingDate: "",
    });
  };

  const billsInProgress = bills.filter(
    (b) => !["adoptee", "rejetee", "declassee"].includes(b.status),
  );
  const recentActivity = stats?.recentActivity.slice(0, 5) || [];

  const genderStats = {
    homme: deputies.filter((d) => d.gender === "homme").length,
    femme: deputies.filter((d) => d.gender === "femme").length,
  };

  const billsReadyForPlenary = bills.filter((b) => b.status === "validee");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord - Président
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble du processus législatif
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={convocationDialog} onOpenChange={setConvocationDialog}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Convoquer le Rapporteur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convocation du Rapporteur</DialogTitle>
                <DialogDescription>
                  Envoyer une convocation pour organiser une réunion
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={convocationData.title}
                    onChange={(e) =>
                      setConvocationData({
                        ...convocationData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Objet de la convocation"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type de réunion</Label>
                  <Select
                    value={convocationData.type}
                    onValueChange={(value: any) =>
                      setConvocationData({ ...convocationData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conference">
                        Conférence des Présidents
                      </SelectItem>
                      <SelectItem value="pleniere">Plénière</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date de la réunion</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={convocationData.meetingDate}
                    onChange={(e) =>
                      setConvocationData({
                        ...convocationData,
                        meetingDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={convocationData.message}
                    onChange={(e) =>
                      setConvocationData({
                        ...convocationData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Détails de la convocation..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleSendConvocation} className="w-full">
                  Envoyer la convocation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/deputies")}
          >
            <Users className="mr-2 h-4 w-4" />
            Voir les Députés
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total des lois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {stats?.totalBills || 0}
                </div>
                <p className="text-xs text-gray-600">en cours de traitement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Députés actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {deputies.filter((d) => d.isActive).length}
                </div>
                <p className="text-xs text-gray-600">
                  {genderStats.homme}H / {genderStats.femme}F
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Prêtes pour plénière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Vote className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {billsReadyForPlenary.length}
                </div>
                <p className="text-xs text-gray-600">validées et analysées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Participation moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {Math.round(
                    deputies.reduce((acc, d) => acc + d.participationRate, 0) /
                      deputies.length,
                  )}
                  %
                </div>
                <p className="text-xs text-gray-600">taux de participation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Plenary Control */}
      {activePlenary && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Vote className="mr-2 h-5 w-5" />
              Session plénière active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  Loi en cours de vote:{" "}
                  {bills.find((b) => b.id === activePlenary.billId)?.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Session {activePlenary.isActive ? "ouverte" : "fermée"}
                </p>
              </div>
              <Button
                onClick={() => endPlenary(activePlenary.billId)}
                variant="destructive"
              >
                <Square className="mr-2 h-4 w-4" />
                Clôturer le vote
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bills Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline des lois en cours</CardTitle>
            <CardDescription>
              Suivi des propositions de loi par étape
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billsInProgress.length > 0 ? (
                billsInProgress.slice(0, 5).map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {bill.status === "en_attente" && (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                      {bill.status === "en_conference" && (
                        <Calendar className="h-5 w-5 text-blue-600" />
                      )}
                      {bill.status === "au_bureau_etudes" && (
                        <FileText className="h-5 w-5 text-purple-600" />
                      )}
                      {bill.status === "validee" && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {bill.status === "en_pleniere" && (
                        <Vote className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{bill.title}</h4>
                      <p className="text-xs text-gray-600">
                        Par {bill.authorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(bill.updatedAt), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(bill.status)}>
                      {getStatusDisplayName(bill.status)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Aucune loi en cours de traitement
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plenary Management */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion des plénières</CardTitle>
            <CardDescription>Lois prêtes à être votées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {billsReadyForPlenary.length > 0 ? (
                billsReadyForPlenary.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{bill.title}</h4>
                      <p className="text-xs text-gray-600">
                        Par {bill.authorName}
                      </p>
                      {bill.studyBureauAnalysis && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Analysée par le Bureau d'Études
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => startPlenary(bill.id)}
                      disabled={!!activePlenary}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Démarrer le vote
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune loi prête pour le vote</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>
            Dernières actions dans le processus législatif
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 text-sm"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p>{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(activity.date), "dd MMM yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/dashboard/deputies")}
        >
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold">Gestion des Députés</h3>
            <p className="text-sm text-gray-600 mt-2">
              Vue d'ensemble et statistiques des députés
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/dashboard/stats")}
        >
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold">Statistiques détaillées</h3>
            <p className="text-sm text-gray-600 mt-2">
              Analyses et graphiques du processus législatif
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/dashboard/documents")}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold">Documents législatifs</h3>
            <p className="text-sm text-gray-600 mt-2">
              Accès aux documents et archives
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PresidentDashboard;
