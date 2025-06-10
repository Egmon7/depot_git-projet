import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Check,
  X,
  Search,
  ArrowLeft,
  Eye,
  Calendar,
  User,
  Filter,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

const BillsManagement = () => {
  const { bills, validateBill, updateBillStatus } = useLegislative();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [decisionDialog, setDecisionDialog] = useState(false);
  const [observations, setObservations] = useState("");

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const billStats = {
    total: bills.length,
    enAttente: bills.filter((b) => b.status === "en_attente").length,
    enConference: bills.filter((b) => b.status === "en_conference").length,
    validees: bills.filter((b) => b.status === "validee").length,
    declassees: bills.filter((b) => b.status === "declassee").length,
    enPleniere: bills.filter((b) => b.status === "en_pleniere").length,
    adoptees: bills.filter((b) => b.status === "adoptee").length,
    rejetees: bills.filter((b) => b.status === "rejetee").length,
  };

  const handleValidateBill = (
    billId: string,
    decision: "valider" | "declasser",
  ) => {
    validateBill(billId, decision, observations);
    if (decision === "valider") {
      updateBillStatus(billId, "au_bureau_etudes");
    }

    toast({
      title: decision === "valider" ? "Loi validée" : "Loi déclassée",
      description: `La proposition a été ${decision === "valider" ? "validée et envoyée au Bureau d'Études" : "déclassée"}.`,
    });

    setDecisionDialog(false);
    setSelectedBill(null);
    setObservations("");
  };

  const openDecisionDialog = (bill: any) => {
    setSelectedBill(bill);
    setDecisionDialog(true);
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Gestion des lois
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Supervision et validation des propositions de loi
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("all")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {billStats.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Total
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("en_attente")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {billStats.enAttente}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              En attente
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("en_conference")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {billStats.enConference}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              En conférence
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("validee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {billStats.validees}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Validées
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("declassee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {billStats.declassees}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Déclassées
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("en_pleniere")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {billStats.enPleniere}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              En plénière
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("adoptee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {billStats.adoptees}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Adoptées
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("rejetee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {billStats.rejetees}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Rejetées
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher des lois..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="en_conference">En conférence</SelectItem>
                <SelectItem value="au_bureau_etudes">
                  Au bureau d'études
                </SelectItem>
                <SelectItem value="validee">Validée</SelectItem>
                <SelectItem value="en_pleniere">En plénière</SelectItem>
                <SelectItem value="adoptee">Adoptée</SelectItem>
                <SelectItem value="rejetee">Rejetée</SelectItem>
                <SelectItem value="declassee">Déclassée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {filteredBills.length} loi(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Liste des propositions de loi
          </CardTitle>
          <CardDescription>
            Gérez et validez les propositions selon leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="border rounded-lg p-4 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {bill.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Sujet:
                          </span>
                          <p className="text-sm">{bill.subject}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Auteur:
                          </span>
                          <p className="text-sm">{bill.authorName}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Date de dépôt:
                          </span>
                          <p className="text-sm">
                            {format(new Date(bill.createdAt), "dd MMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusDisplayName(bill.status)}
                        </Badge>

                        {bill.conferenceDecision && (
                          <Badge
                            variant="outline"
                            className={
                              bill.conferenceDecision.decision === "valider"
                                ? "border-green-200 text-green-700 ml-2"
                                : "border-red-200 text-red-700 ml-2"
                            }
                          >
                            Décision:{" "}
                            {bill.conferenceDecision.decision === "valider"
                              ? "Validée"
                              : "Déclassée"}
                          </Badge>
                        )}

                        {bill.studyBureauAnalysis && (
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-700 ml-2"
                          >
                            Analysée
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                        {bill.motives}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBill(bill)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Détails
                      </Button>

                      {(bill.status === "en_attente" ||
                        bill.status === "en_conference") && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleValidateBill(bill.id, "valider")
                            }
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleValidateBill(bill.id, "declasser")
                            }
                          >
                            <X className="mr-1 h-3 w-3" />
                            Déclasser
                          </Button>
                        </div>
                      )}

                      {(bill.status === "en_attente" ||
                        bill.status === "en_conference") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDecisionDialog(bill)}
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Décision avec notes
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Aucune loi trouvée
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "Essayez de modifier vos critères de recherche."
                    : "Aucune proposition de loi pour le moment."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Decision Dialog */}
      <Dialog open={decisionDialog} onOpenChange={setDecisionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Décision avec observations</DialogTitle>
            <DialogDescription>
              Valider ou déclasser: {selectedBill?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observations">Observations (optionnel)</Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Commentaires ou justifications de la décision..."
                rows={3}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleValidateBill(selectedBill?.id, "valider")}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Valider
              </Button>
              <Button
                onClick={() =>
                  handleValidateBill(selectedBill?.id, "declasser")
                }
                variant="destructive"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Déclasser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Sujet</Label>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
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
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedBill.motives}
                  </p>
                </div>
              </div>

              {selectedBill.conferenceDecision && (
                <div>
                  <Label className="text-sm font-medium">
                    Décision de la conférence
                  </Label>
                  <div
                    className={`p-4 rounded-lg mt-2 ${
                      selectedBill.conferenceDecision.decision === "valider"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-red-50 dark:bg-red-900/20"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedBill.conferenceDecision.decision ===
                      "valider" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
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
                      <p className="text-sm text-gray-700 dark:text-gray-300">
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
    </div>
  );
};

export default BillsManagement;
