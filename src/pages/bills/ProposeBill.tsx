
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLegislative } from "@/contexts/LegislativeContext";
import { Bill } from "@/types/legislative";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, FileText, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { permissions } from "@/utils/permissions";

const ProposeBill = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { proposeBill } = useLegislative();

  const [formData, setFormData] = useState<{
    sujet: string;
    code: string;
    exposer: string;
    pieceFile?: File;
  }>({
    sujet: "",
    code: "",
    exposer: "",
    pieceFile: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, pieceFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour proposer une loi.",
        variant: "destructive",
      });
      return;
    }

    if (!permissions.canProposeBill(user.role)) {
      toast({
        title: "Erreur",
        description: "Vous n'avez pas la permission de proposer une loi.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.sujet || !formData.code || !formData.exposer) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await proposeBill({
        sujet: formData.sujet,
        code: formData.code,
        exposer: formData.exposer,
        pieceFile: formData.pieceFile,
      });
      toast({
        title: "Succès",
        description: "Proposition de loi déposée avec succès.",
      });
      navigate("/dashboard/my-bills");
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du dépôt de la proposition.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard/my-bills")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposer une loi</h1>
          <p className="text-gray-600 mt-1">
            Remplissez les informations ci-dessous pour soumettre une nouvelle proposition de loi.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Nouvelle proposition de loi
          </CardTitle>
          <CardDescription>
            Complétez le formulaire pour déposer votre proposition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="sujet">Sujet de la loi</Label>
              <Input
                id="sujet"
                name="sujet"
                value={formData.sujet}
                onChange={handleInputChange}
                placeholder="Entrez le sujet de la proposition"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Code de la loi</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Entrez le code de la proposition (ex. LOI-2025-001)"
                required
              />
            </div>
            <div>
              <Label htmlFor="exposer">Exposé des motifs</Label>
              <Textarea
                id="exposer"
                name="exposer"
                value={formData.exposer}
                onChange={handleInputChange}
                placeholder="Décrivez les motifs et objectifs de la proposition"
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="piece">Pièce jointe (optionnel)</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="piece"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData.pieceFile && (
                  <span className="text-sm text-gray-600">
                    {formData.pieceFile.name}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Formats acceptés : PDF, DOC, DOCX (max 5MB)
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/my-bills")}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Envoi en cours..." : "Déposer la proposition"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposeBill;
