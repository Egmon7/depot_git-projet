import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  MapPin,
  Users,
  ArrowLeft,
  Settings,
  Moon,
  Sun,
  Shield,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleDisplayName } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    parlementaryGroup: user?.parlementaryGroup || "",
    constituency: user?.constituency || "",
  });

  const handleSave = () => {
    if (user) {
      updateUser({
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        parlementaryGroup: formData.parlementaryGroup,
        constituency: formData.constituency,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      parlementaryGroup: user?.parlementaryGroup || "",
      constituency: user?.constituency || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mon profil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos informations personnelles et préférences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Vos informations de profil dans le système législatif
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <Badge variant="default" className="text-sm">
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        user.isActive
                          ? "text-green-700 border-green-200"
                          : "text-red-700 border-red-200"
                      }
                    >
                      {user.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  onClick={() =>
                    isEditing ? handleCancel() : setIsEditing(true)
                  }
                >
                  {isEditing ? "Annuler" : "Modifier"}
                </Button>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input
                    id="role"
                    value={getRoleDisplayName(user.role)}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {user.role === "depute" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="parlementaryGroup">
                        Groupe parlementaire
                      </Label>
                      <Input
                        id="parlementaryGroup"
                        value={formData.parlementaryGroup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            parlementaryGroup: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        placeholder="Ex: UDPS, MLC, PPRD..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="constituency">Circonscription</Label>
                      <Input
                        id="constituency"
                        value={formData.constituency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            constituency: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        placeholder="Funa, Mont Amba, Lukunga, Tshangu"
                      />
                    </div>
                  </>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    Enregistrer les modifications
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Informations du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              {user.parlementaryGroup && (
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Groupe parlementaire</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.parlementaryGroup}
                    </p>
                  </div>
                </div>
              )}

              {user.constituency && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Circonscription</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.constituency}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Membre depuis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(), "MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Mode sombre</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Activer le thème sombre
                    </p>
                  </div>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">ID Utilisateur</p>
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {user.id}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific info */}
          {user.role === "depute" && (
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de député</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Propositions déposées
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
