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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Scale,
  Search,
  User,
} from "lucide-react";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const StudyBureauDashboard = () => {
  const { user } = useAuth();
  const { bills, addStudyBureauAnalysis, addNotification } = useLegislative();

  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [analysisDialog, setAnalysisDialog] = useState(false);
  const [analysisData, setAnalysisData] = useState({
    fundAnalysis: "",
    formAnalysis: "",
    isLegallyCorrect: false,
    isOriginal: false,
    observations: "",
  });
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
  // Bills assigned to study bureau
  const billsToAnalyze = bills.filter((b) => b.etat === BillStatus.au_bureau_etudes);


  // Bills already analyzed
  const analyzedBills = bills.filter((b) => b.study_bureau_analysis);

  const handleSubmitAnalysis = (billId: string) => {
    const analysis = {
      ...analysisData,
      date: new Date(),
    };


    // Notify rapporteur about completed analysis
    addNotification({
      recipientId: "3", // Rapporteur ID
      type: "bureau_etudes",
      title: "Analyse du Bureau d'Études terminée",
      message: `L'analyse de la loi "${selectedBill?.title}" est terminée et prête pour la deuxième conférence.`,
      isRead: false,
      metadata: {
        billId,
        sender: `${user?.nom} ${user?.postnom}`,
      },
    });

    setAnalysisDialog(false);
    setSelectedBill(null);
    resetAnalysisForm();
  };

  const resetAnalysisForm = () => {
    setAnalysisData({
      fundAnalysis: "",
      formAnalysis: "",
      isLegallyCorrect: false,
      isOriginal: false,
      observations: "",
    });
  };

  const openAnalysisDialog = (bill: any) => {
    setSelectedBill(bill);
    setAnalysisDialog(true);
    if (bill.studyBureauAnalysis) {
      setAnalysisData(bill.studyBureauAnalysis);
    }
  };

  const stats = {
    toAnalyze: billsToAnalyze.length,
    analyzed: analyzedBills.length,
    legallyCorrect: analyzedBills.filter(b => !!b.study_bureau_analysis).length,
    original: analyzedBills.filter(b => !!b.study_bureau_analysis).length,
  };
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bureau d'Études</h1>
          <p className="text-gray-600 mt-1">
            Analyse technique et juridique des propositions de loi
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              À analyser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.toAnalyze}</div>
                <p className="text-xs text-gray-600">nouvelles assignations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Analyses terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.analyzed}</div>
                <p className="text-xs text-gray-600">analyses complètes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conformes juridiquement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.legallyCorrect}</div>
                <p className="text-xs text-gray-600">
                  sur {stats.analyzed} analysées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Propositions originales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.original}</div>
                <p className="text-xs text-gray-600">non déjà déposées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills to Analyze */}
      <Card>
        <CardHeader>
          <CardTitle>Lois reçues pour analyse</CardTitle>
          <CardDescription>
            Propositions validées par la conférence et assignées au bureau
            d'études
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billsToAnalyze.length > 0 ? (
              billsToAnalyze.map((bill) => (
                <div key={bill.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {bill.sujet}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Sujet:</strong> {bill.sujet}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Auteur:</strong> {bill.author_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Assignée le:</strong>{" "}
                            {format(new Date(bill.dateModification), "dd MMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                        </div>
                        <div>
                          <Badge className={getStatusColor(bill.etat)}>
                            {getStatusDisplayName(bill.etat)}
                          </Badge>
                          {bill.conference_decision && (
                            <div className="mt-2">
                              <p className="text-xs text-green-600">
                                ✓ Validée en conférence le{" "}
                                {format(
                                  new Date(bill.conference_decision.date),
                                  "dd MMM",
                                  { locale: fr },
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">
                          Exposé des motifs:
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {bill.exposer}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedBill(bill)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => openAnalysisDialog(bill)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Analyser
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune loi à analyser
                </h3>
                <p className="text-gray-600">
                  Toutes les lois assignées ont été analysées ou aucune nouvelle
                  assignation.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Dialog */}
      <Dialog open={analysisDialog} onOpenChange={setAnalysisDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Analyse de la proposition de loi</DialogTitle>
            <DialogDescription>{selectedBill?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="fundAnalysis" className="text-sm font-medium">
                Analyse du fond *
              </Label>
              <Textarea
                id="fundAnalysis"
                value={analysisData.fundAnalysis}
                onChange={(e) =>
                  setAnalysisData({
                    ...analysisData,
                    fundAnalysis: e.target.value,
                  })
                }
                placeholder="Analyse du contenu, de la pertinence et de l'impact de la proposition..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="formAnalysis" className="text-sm font-medium">
                Analyse de la forme *
              </Label>
              <Textarea
                id="formAnalysis"
                value={analysisData.formAnalysis}
                onChange={(e) =>
                  setAnalysisData({
                    ...analysisData,
                    formAnalysis: e.target.value,
                  })
                }
                placeholder="Analyse de la structure, de la rédaction et de la présentation..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="legallyCorrect"
                    checked={analysisData.isLegallyCorrect}
                    onCheckedChange={(checked) =>
                      setAnalysisData({
                        ...analysisData,
                        isLegallyCorrect: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="legallyCorrect" className="text-sm">
                    Est juridiquement correcte
                  </Label>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  La proposition respecte les normes juridiques et
                  constitutionnelles
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isOriginal"
                    checked={analysisData.isOriginal}
                    onCheckedChange={(checked) =>
                      setAnalysisData({
                        ...analysisData,
                        isOriginal: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isOriginal" className="text-sm">
                    Est une proposition originale
                  </Label>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  N'a pas été déjà déposée ou traitée récemment
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="observations" className="text-sm font-medium">
                Observations et recommandations
              </Label>
              <Textarea
                id="observations"
                value={analysisData.observations}
                onChange={(e) =>
                  setAnalysisData({
                    ...analysisData,
                    observations: e.target.value,
                  })
                }
                placeholder="Commentaires supplémentaires, recommandations d'amendements..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysisDialog(false);
                  resetAnalysisForm();
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleSubmitAnalysis(selectedBill?.id)}
                disabled={
                  !analysisData.fundAnalysis || !analysisData.formAnalysis
                }
              >
                <Send className="mr-2 h-4 w-4" />
                Transmettre l'analyse
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bill Detail Modal */}
      {selectedBill && !analysisDialog && (
        <Dialog
          open={!!selectedBill}
          onOpenChange={() => setSelectedBill(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedBill.title}</DialogTitle>
              <DialogDescription>
                Proposition de loi par {selectedBill.authorName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Sujet</Label>
                  <p className="text-sm text-gray-700">
                    {selectedBill.subject}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Statut</Label>
                  <Badge className={getStatusColor(selectedBill.status)}>
                    {getStatusDisplayName(selectedBill.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Exposé des motifs</Label>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-sm text-gray-700">
                    {selectedBill.motives}
                  </p>
                </div>
              </div>

              {selectedBill.conferenceDecision && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium">
                    Décision de la conférence
                  </Label>
                  <div className="mt-2 p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        Validée
                      </span>
                      <span className="text-sm text-gray-500">
                        le{" "}
                        {format(
                          new Date(selectedBill.conferenceDecision.date),
                          "dd MMM yyyy",
                          { locale: fr },
                        )}
                      </span>
                    </div>
                    {selectedBill.conferenceDecision.observations && (
                      <p className="text-sm text-gray-700">
                        {selectedBill.conferenceDecision.observations}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Analysis History */}
      <Card>
        <CardHeader>
          <CardTitle>Mes analyses terminées</CardTitle>
          <CardDescription>Historique des analyses effectuées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyzedBills.length > 0 ? (
              analyzedBills.slice(0, 10).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{bill.sujet}</h4>
                    <p className="text-xs text-gray-600">
                      Par {bill.author_name}
                    </p>
                    <div className="flex space-x-4 mt-1">
                      <span
                        className={`text-xs ${bill.study_bureau_analysis? "text-green-600" : "text-red-600"}`}
                      >
                        {bill.study_bureau_analysis
                          ? "✓ Juridiquement correcte"
                          : "✗ Problèmes juridiques"}
                      </span>
                      <span
                        className={`text-xs ${bill.study_bureau_analysis.avis ? "text-green-600" : "text-orange-600"}`}
                      >
                        {bill.study_bureau_analysis.avis
                          ? "✓ Proposition originale"
                          : "⚠ Déjà déposée"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      Analysée
                    </Badge>
                    {bill.study_bureau_analysis?.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(bill.study_bureau_analysis.date),
                          "dd MMM yyyy",
                          { locale: fr },
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aucune analyse terminée pour le moment
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
            Guide d'analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-2">Analyse du fond</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pertinence et utilité de la proposition</li>
                <li>• Impact sur la société et l'économie</li>
                <li>• Cohérence avec les lois existantes</li>
                <li>• Faisabilité de mise en œuvre</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Analyse de la forme
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Structure et organisation du texte</li>
                <li>• Clarté et précision de la rédaction</li>
                <li>• Respect des normes de présentation</li>
                <li>• Complétude des informations</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-800">
              Processus de transmission
            </h4>
            <p className="text-sm text-blue-700">
              Une fois l'analyse terminée, elle est automatiquement transmise au
              Rapporteur qui se chargera de notifier la Conférence des
              Présidents pour la deuxième phase d'examen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyBureauDashboard;
