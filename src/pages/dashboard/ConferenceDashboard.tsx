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
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Eye,
  Calendar,
  User,
  AlertTriangle,
} from "lucide-react";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ConferenceDashboard = () => {
  const { user } = useAuth();
  const { bills, validateBill, updateBillStatus } = useLegislative();

  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [decisionDialog, setDecisionDialog] = useState(false);
  const [observations, setObservations] = useState("");

  // Bills waiting for conference decision
  const billsToReview = bills.filter((b) =>
    ["en_attente", "en_conference"].includes(b.status),
  );

  // Bills already decided by conference
  const decidedBills = bills.filter((b) => b.conferenceDecision);

  const handleDecision = (
    billId: string,
    decision: "valider" | "declasser",
  ) => {
    validateBill(billId, decision, observations);
    if (decision === "valider") {
      updateBillStatus(billId, "au_bureau_etudes");
    }
    setDecisionDialog(false);
    setSelectedBill(null);
    setObservations("");
  };

  const openBillDetail = (bill: any) => {
    setSelectedBill(bill);
  };

  const stats = {
    total: billsToReview.length,
    enAttente: bills.filter((b) => b.status === "en_attente").length,
    validees: bills.filter((b) => b.conferenceDecision?.decision === "valider")
      .length,
    declassees: bills.filter(
      (b) => b.conferenceDecision?.decision === "declasser",
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Conférence des Présidents
          </h1>
          <p className="text-gray-600 mt-1">
            Examen et validation des propositions de loi
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              À examiner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.enAttente}</div>
                <p className="text-xs text-gray-600">nouvelles propositions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total à traiter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-gray-600">propositions en cours</p>
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
                <div className="text-2xl font-bold">{stats.validees}</div>
                <p className="text-xs text-gray-600">approuvées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Déclassées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.declassees}</div>
                <p className="text-xs text-gray-600">rejetées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills to Review */}
      <Card>
        <CardHeader>
          <CardTitle>Propositions à examiner</CardTitle>
          <CardDescription>
            Lois nécessitant une décision de la conférence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billsToReview.length > 0 ? (
              billsToReview.map((bill) => (
                <div key={bill.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {bill.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Sujet:</strong> {bill.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Auteur:</strong> {bill.authorName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Déposée le:</strong>{" "}
                            {format(new Date(bill.createdAt), "dd MMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                        </div>
                        <div>
                          <Badge className={getStatusColor(bill.status)}>
                            {getStatusDisplayName(bill.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">
                          Exposé des motifs:
                        </h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {bill.motives}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBillDetail(bill)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedBill(bill);
                                setDecisionDialog(true);
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Prendre une décision
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Décision de la conférence
                              </DialogTitle>
                              <DialogDescription>
                                Valider ou déclasser la proposition:{" "}
                                {bill.title}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="observations">
                                  Observations (optionnel)
                                </Label>
                                <Textarea
                                  id="observations"
                                  value={observations}
                                  onChange={(e) =>
                                    setObservations(e.target.value)
                                  }
                                  placeholder="Commentaires ou justifications de la décision..."
                                  rows={3}
                                />
                              </div>
                              <div className="flex space-x-3">
                                <Button
                                  onClick={() =>
                                    handleDecision(bill.id, "valider")
                                  }
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Valider
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDecision(bill.id, "declasser")
                                  }
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Déclasser
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune proposition à examiner
                </h3>
                <p className="text-gray-600">
                  Toutes les propositions ont été traitées ou aucune nouvelle
                  proposition n'a été déposée.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Decision History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des décisions</CardTitle>
          <CardDescription>
            Propositions déjà examinées par la conférence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {decidedBills.length > 0 ? (
              decidedBills.slice(0, 10).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{bill.title}</h4>
                    <p className="text-xs text-gray-600">
                      Par {bill.authorName}
                    </p>
                    {bill.conferenceDecision?.observations && (
                      <p className="text-xs text-gray-500 mt-1">
                        <strong>Observations:</strong>{" "}
                        {bill.conferenceDecision.observations}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <Badge
                        className={
                          bill.conferenceDecision?.decision === "valider"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {bill.conferenceDecision?.decision === "valider" ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Validée
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-1 h-3 w-3" />
                            Déclassée
                          </>
                        )}
                      </Badge>
                      {bill.conferenceDecision?.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {format(
                            new Date(bill.conferenceDecision.date),
                            "dd MMM yyyy",
                            { locale: fr },
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aucune décision prise pour le moment
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bill Detail Modal */}
      {selectedBill && !decisionDialog && (
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
                <div>
                  <Label className="text-sm font-medium">Date de dépôt</Label>
                  <p className="text-sm text-gray-700">
                    {format(
                      new Date(selectedBill.createdAt),
                      "dd MMMM yyyy à HH:mm",
                      { locale: fr },
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Dernière mise à jour
                  </Label>
                  <p className="text-sm text-gray-700">
                    {format(
                      new Date(selectedBill.updatedAt),
                      "dd MMMM yyyy à HH:mm",
                      { locale: fr },
                    )}
                  </p>
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

              {selectedBill.attachments &&
                selectedBill.attachments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">
                      Pièces jointes
                    </Label>
                    <div className="space-y-2 mt-2">
                      {selectedBill.attachments.map(
                        (attachment: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-2 border rounded"
                          >
                            <FileText className="h-4 w-4 text-gray-600" />
                            <span className="text-sm">{attachment.name}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {selectedBill.conferenceDecision && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium">
                    Décision de la conférence
                  </Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedBill.conferenceDecision.decision ===
                      "valider" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {selectedBill.conferenceDecision.decision === "valider"
                          ? "Validée"
                          : "Déclassée"}
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

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-blue-600" />
            Critères d'évaluation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-2">Validation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pertinence du sujet proposé</li>
                <li>• Clarté de l'exposé des motifs</li>
                <li>• Faisabilité de la proposition</li>
                <li>• Conformité aux procédures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Déclassement</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Proposition incomplète ou mal formulée</li>
                <li>• Sujet déjà traité récemment</li>
                <li>• Non-conformité aux règles</li>
                <li>• Manque de justification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConferenceDashboard;
