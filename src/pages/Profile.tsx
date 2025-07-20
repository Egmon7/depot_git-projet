import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    postnom: user?.postnom || "",
    email: user?.email || "",
    groupe_parlementaire: user?.groupe_parlementaire || "",
    circonscription: user?.circonscription || "",
  });

  if (!user) return <div>Chargement du profil...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (updateUser) {
      updateUser({
        ...user,
        nom: formData.nom,
        postnom: formData.postnom,
        email: formData.email,
        groupe_parlementaire: formData.groupe_parlementaire,
        circonscription: formData.circonscription,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nom: user.nom,
      postnom: user.postnom,
      email: user.email,
      groupe_parlementaire: user.groupe_parlementaire,
      circonscription: user.circonscription,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nom">Nom</Label>
            <Input
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="postnom">Postnom</Label>
            <Input
              name="postnom"
              value={formData.postnom}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="groupe_parlementaire">Groupe parlementaire</Label>
            <Input
              name="groupe_parlementaire"
              value={formData.groupe_parlementaire}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="circonscription">Circonscription</Label>
            <Input
              name="circonscription"
              value={formData.circonscription}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing ? (
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSave}>Enregistrer</Button>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
            </div>
          ) : (
            <div className="pt-4">
              <Button onClick={() => setIsEditing(true)}>Modifier</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
