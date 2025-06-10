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
import {
  Bell,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const NotificationCenter = () => {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useLegislative();
  const navigate = useNavigate();

  const userNotifications = notifications
    .filter((n) => n.recipientId === user?.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "conference":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "pleniere":
        return <Users className="h-5 w-5 text-green-600" />;
      case "bureau_etudes":
        return <FileText className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "conference":
        return "Conférence";
      case "pleniere":
        return "Plénière";
      case "bureau_etudes":
        return "Bureau d'Études";
      default:
        return "Général";
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markNotificationRead(notification.id);
    }
  };

  const markAllAsRead = () => {
    userNotifications
      .filter((n) => !n.isRead)
      .forEach((n) => markNotificationRead(n.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Centre de notifications
            </h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} notification(s) non lue(s)`
                : "Toutes les notifications sont lues"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Marquer tout comme lu
          </Button>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {userNotifications.length > 0 ? (
          userNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                !notification.isRead ? "border-blue-200 bg-blue-50" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(notification.type)}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{notification.message}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(
                            new Date(notification.createdAt),
                            "dd MMM yyyy à HH:mm",
                            { locale: fr },
                          )}
                        </div>

                        {notification.metadata?.sender && (
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            De: {notification.metadata.sender}
                          </div>
                        )}
                      </div>

                      {notification.metadata?.meetingDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Réunion le{" "}
                          {format(
                            new Date(notification.metadata.meetingDate),
                            "dd MMM à HH:mm",
                            { locale: fr },
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600">
                Vous n'avez reçu aucune notification pour le moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Types Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Types de notifications
          </CardTitle>
          <CardDescription>
            Comprendre les différents types de notifications que vous pouvez
            recevoir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">
                    Conférence des Présidents
                  </h4>
                  <p className="text-xs text-gray-600">
                    Convocations pour les réunions de la conférence des
                    présidents
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Sessions plénières</h4>
                  <p className="text-xs text-gray-600">
                    Notifications pour les sessions de vote en plénière
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Bureau d'Études</h4>
                  <p className="text-xs text-gray-600">
                    Notifications liées aux analyses du bureau d'études
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Bell className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Général</h4>
                  <p className="text-xs text-gray-600">
                    Informations générales et mises à jour du système
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
