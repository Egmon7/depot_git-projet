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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  Send,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const RapporteurDashboard = () => {
  const { user } = useAuth();
  const {
    deputies,
    notifications,
    bills,
    addNotification,
    markNotificationRead,
  } = useLegislative();
  const navigate = useNavigate();

  const [convocationDialog, setConvocationDialog] = useState(false);
  const [convocationData, setConvocationData] = useState({
    title: "",
    message: "",
    type: "conference" as "conference" | "pleniere" | "bureau_etudes",
    meetingDate: "",
    selectedMembers: [] as string[],
  });

  const myNotifications = notifications.filter(
    (n) => n.recipientId === user?.id,
  );
  const unreadNotifications = myNotifications.filter((n) => !n.isRead);
  const sentConvocations = notifications.filter((n) =>
    n.metadata?.sender?.includes(user?.firstName || ""),
  );

  const handleSendConvocation = () => {
    // Send notifications to selected members
    convocationData.selectedMembers.forEach((memberId) => {
      addNotification({
        recipientId: memberId,
        type: convocationData.type,
        title: convocationData.title,
        message: convocationData.message,
        isRead: false,
        metadata: {
          meetingDate: new Date(convocationData.meetingDate),
          sender: `${user?.firstName} ${user?.lastName}`,
        },
      });
    });

    setConvocationDialog(false);
    setConvocationData({
      title: "",
      message: "",
      type: "conference",
      meetingDate: "",
      selectedMembers: [],
    });
  };

  const handleMemberSelection = (memberId: string, checked: boolean) => {
    if (checked) {
      setConvocationData({
        ...convocationData,
        selectedMembers: [...convocationData.selectedMembers, memberId],
      });
    } else {
      setConvocationData({
        ...convocationData,
        selectedMembers: convocationData.selectedMembers.filter(
          (id) => id !== memberId,
        ),
      });
    }
  };

  const recentBills = bills
    .filter((b) =>
      ["en_conference", "au_bureau_etudes", "validee"].includes(b.status),
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord - Rapporteur
          </h1>
          <p className="text-gray-600 mt-1">
            Centre de communication et coordination
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={convocationDialog} onOpenChange={setConvocationDialog}>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Envoyer une convocation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nouvelle convocation</DialogTitle>
                <DialogDescription>
                  Convoquer les membres pour une réunion ou session
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre de la convocation</Label>
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
                  <Label htmlFor="type">Type de convocation</Label>
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
                      <SelectItem value="bureau_etudes">
                        Bureau d'Études
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Date et heure de la réunion</Label>
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
                  <Label>Sélectionner les membres à convoquer</Label>
                  <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                    {deputies.map((deputy) => (
                      <div
                        key={deputy.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={deputy.id}
                          checked={convocationData.selectedMembers.includes(
                            deputy.id,
                          )}
                          onCheckedChange={(checked) =>
                            handleMemberSelection(deputy.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={deputy.id}
                          className="flex-1 cursor-pointer"
                        >
                          {deputy.firstName} {deputy.lastName} -{" "}
                          {deputy.parlementaryGroup}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {convocationData.selectedMembers.length} membre(s)
                    sélectionné(s)
                  </p>
                </div>

                <div>
                  <Label htmlFor="message">Message de la convocation</Label>
                  <Textarea
                    id="message"
                    value={convocationData.message}
                    onChange={(e) =>
                      setConvocationData({
                        ...convocationData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Détails de la convocation, ordre du jour..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSendConvocation}
                  className="w-full"
                  disabled={
                    convocationData.selectedMembers.length === 0 ||
                    !convocationData.title ||
                    !convocationData.meetingDate
                  }
                >
                  Envoyer la convocation
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/notifications")}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications ({unreadNotifications.length})
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Notifications reçues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {myNotifications.length}
                </div>
                <p className="text-xs text-gray-600">
                  {unreadNotifications.length} non lues
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Convocations envoyées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {sentConvocations.length}
                </div>
                <p className="text-xs text-gray-600">ce mois-ci</p>
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
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {deputies.filter((d) => d.isActive).length}
                </div>
                <p className="text-xs text-gray-600">à coordonner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Lois en traitement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{recentBills.length}</div>
                <p className="text-xs text-gray-600">actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications récentes
            </CardTitle>
            <CardDescription>Messages et convocations reçus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myNotifications.length > 0 ? (
                myNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      !notification.isRead ? "border-blue-200 bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markNotificationRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(
                              new Date(notification.createdAt),
                              "dd MMM HH:mm",
                              { locale: fr },
                            )}
                          </span>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune notification</p>
                </div>
              )}
            </div>
            {myNotifications.length > 5 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/dashboard/notifications")}
              >
                Voir toutes les notifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Bills Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Suivi des lois
            </CardTitle>
            <CardDescription>
              État d'avancement des propositions de loi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.length > 0 ? (
                recentBills.map((bill) => (
                  <div key={bill.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{bill.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Par {bill.authorName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Mise à jour:{" "}
                          {format(new Date(bill.updatedAt), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge
                          variant="outline"
                          className={
                            bill.status === "en_conference"
                              ? "border-blue-200 text-blue-700"
                              : bill.status === "au_bureau_etudes"
                                ? "border-purple-200 text-purple-700"
                                : "border-green-200 text-green-700"
                          }
                        >
                          {bill.status === "en_conference" && (
                            <Calendar className="mr-1 h-3 w-3" />
                          )}
                          {bill.status === "au_bureau_etudes" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {bill.status === "validee" && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          )}
                          {bill.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
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
      </div>

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
              Liste et contacts des députés
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setConvocationDialog(true)}
        >
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold">Nouvelle Convocation</h3>
            <p className="text-sm text-gray-600 mt-2">
              Organiser une réunion ou session
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/dashboard/documents")}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold">Documents</h3>
            <p className="text-sm text-gray-600 mt-2">
              Accès aux documents législatifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Communication Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
            Guide de communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Phases de convocation
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Conférence:</strong> Examen initial des propositions
                </li>
                <li>
                  • <strong>Bureau d'Études:</strong> Retour après analyse
                </li>
                <li>
                  • <strong>Plénière:</strong> Session de vote final
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Responsabilités</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Relayer les communications du Président</li>
                <li>• Coordonner les réunions et sessions</li>
                <li>• Transmettre les résultats du Bureau d'Études</li>
                <li>• Assurer le suivi des notifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapporteurDashboard;
