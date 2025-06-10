import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Send,
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProposeBill = () => {
  const { user } = useAuth();
  const { proposeBill } = useLegislative();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    motives: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est obligatoire";
    } else if (formData.title.trim().length < 10) {
      newErrors.title = "Le titre doit contenir au moins 10 caractères";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est obligatoire";
    }

    if (!formData.motives.trim()) {
      newErrors.motives = "L'exposé des motifs est obligatoire";
    } else if (formData.motives.trim().length < 50) {
      newErrors.motives =
        "L'exposé des motifs doit contenir au moins 50 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert files to attachment objects (in real app, would upload to server)
      const fileAttachments = attachments.map((file, index) => ({
        id: `${Date.now()}_${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      }));

      proposeBill({
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        motives: formData.motives.trim(),
        attachments: fileAttachments,
      });

      toast({
        title: "Proposition déposée",
        description:
          "Votre proposition de loi a été déposée avec succès et sera examinée par la conférence des présidents.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du dépôt de la proposition.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">
            Proposer une nouvelle loi
          </h1>
          <p className="text-gray-600 mt-1">
            Déposez votre proposition pour examen par l'assemblée
          </p>
        </div>
      </div>

      {/* Guidelines */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Assurez-vous que votre proposition est complète et bien documentée.
          Elle sera d'abord examinée par la Conférence des Présidents, puis
          analysée par le Bureau d'Études avant d'être soumise au vote en
          plénière.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Informations de la proposition
            </CardTitle>
            <CardDescription>
              Complétez tous les champs obligatoires pour déposer votre
              proposition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la proposition *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Loi sur la protection de l'environnement en milieu urbain"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
              <p className="text-xs text-gray-600">
                {formData.title.length}/200 caractères
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Domaine/Sujet *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Ex: Environnement, Éducation, Santé, Justice..."
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            {/* Motives */}
            <div className="space-y-2">
              <Label htmlFor="motives">Exposé des motifs *</Label>
              <Textarea
                id="motives"
                value={formData.motives}
                onChange={(e) => handleInputChange("motives", e.target.value)}
                placeholder="Développez les raisons qui justifient cette proposition de loi, son contexte, ses objectifs et son impact attendu..."
                rows={8}
                className={errors.motives ? "border-red-500" : ""}
              />
              {errors.motives && (
                <p className="text-sm text-red-600">{errors.motives}</p>
              )}
              <p className="text-xs text-gray-600">
                {formData.motives.length} caractères (minimum 50)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Pièces jointes (optionnel)
            </CardTitle>
            <CardDescription>
              Ajoutez des documents supports: études, rapports, textes de
              référence...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-600 mt-1">
                Formats acceptés: PDF, DOC, DOCX, TXT (max 10 MB par fichier)
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Fichiers attachés:</h4>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Author Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du proposant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Nom complet</Label>
                <p className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Groupe parlementaire
                </Label>
                <p className="text-sm text-gray-700">
                  {user?.parlementaryGroup || "Non défini"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Circonscription</Label>
                <p className="text-sm text-gray-700">
                  {user?.constituency || "Non définie"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Date de dépôt</Label>
                <p className="text-sm text-gray-700">
                  {new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Dépôt en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Déposer la proposition
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Process Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
            Processus après dépôt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  Examen en Conférence des Présidents
                </h4>
                <p className="text-xs text-gray-600">
                  Votre proposition sera examinée et soit validée, soit
                  déclassée
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  Analyse par le Bureau d'Études
                </h4>
                <p className="text-xs text-gray-600">
                  Étude technique du fond et de la forme de la proposition
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Deuxième Conférence</h4>
                <p className="text-xs text-gray-600">
                  Fixation de la date de plénière selon les résultats de
                  l'analyse
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-sm">Vote en Plénière</h4>
                <p className="text-xs text-gray-600">
                  Vote final de tous les députés pour adoption ou rejet
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposeBill;
