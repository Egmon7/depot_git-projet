import React, { useState } from "react";
import { useLegislative } from "@/contexts/LegislativeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Bill } from "@/types/legislative";
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
  Download,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";

const BillsManagement = () => {
  const { bills, validateBill, updateBillStatus } = useLegislative();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [decisionDialog, setDecisionDialog] = useState(false);
  const [observations, setObservations] = useState("");

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.etat === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const billStats = {
    total: bills.length,
    enCabinet: bills.filter((b) => b.etat === 0).length,
    auBureauEtudes: bills.filter((b) => b.etat === 1).length,
    enConference: bills.filter((b) => b.etat === 2).length,
    validees: bills.filter((b) => b.etat === 3).length,
    enPleniere: bills.filter((b) => b.etat === 4).length,
    adoptees: bills.filter((b) => b.etat === 5).length,
    rejetees: bills.filter((b) => b.etat === 6).length,
    declassees: bills.filter((b) => b.etat === 7).length,
  };

  const handleValidateBill = async (
    billId: string,
    decision: "valider" | "declasser"
  ) => {
    try {
      await validateBill(billId, decision, observations);
      toast({
        title: decision === "valider" ? "Loi validée" : "Loi déclassée",
        description: `La proposition a été ${decision === "valider" ? "validée et envoyée au Bureau d'Études" : "déclassée"}.`,
      });
      setDecisionDialog(false);
      setSelectedBill(null);
      setObservations("");
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la validation.",
        variant: "destructive",
      });
    }
  };

  const openDecisionDialog = (bill: Bill) => {
    setSelectedBill(bill);
    setDecisionDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des lois</h1>
          <p className="text-gray-600 mt-1">
            Supervision et validation des propositions de loi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("all")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{billStats.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("0")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{billStats.enCabinet}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">En attente</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("1")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{billStats.enConference}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">En conférence</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("2")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{billStats.auBureauEtudes}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Au bureau d'études</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("3")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{billStats.validees}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Validées</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("4")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{billStats.enPleniere}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">En plénière</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("5")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{billStats.adoptees}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Adoptées</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("6")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{billStats.rejetees}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rejetées</div>
          </CardContent>
        </Card>
      </div>

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
                <SelectValue placeholder="Filtrer par état" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les états</SelectItem>
                <SelectItem value="0">En attente</SelectItem>
                <SelectItem value="1">En conférence</SelectItem>
                <SelectItem value="2">Au bureau d'études</SelectItem>
                <SelectItem value="3">Validée</SelectItem>
                <SelectItem value="4">En plénière</SelectItem>
                <SelectItem value="5">Adoptée</SelectItem>
                <SelectItem value="6">Rejetée</SelectItem>
                <SelectItem value="7">Déclassée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {filteredBills.length} loi(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Liste des propositions de loi
          </CardTitle>
          <CardDescription>
            Gérez et validez les propositions selon leur état
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
                      <h3 className="text-lg font-semibold mb-2">{bill.sujet}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Code:</span>
                          <p className="text-sm">{bill.code}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Auteur:</span>
                          <p className="text-sm">{bill.author_name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date de dépôt:</span>
                          <p className="text-sm">
                            {format(new Date(bill.date_depot), "dd MMM yyyy", { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <Badge className={getStatusColor(bill.etat)}>
                          {getStatusDisplayName(bill.etat)}
                        </Badge>
                        {bill.conference_decision && (
                          <Badge
                            variant="outline"
                            className={
                              bill.conference_decision.decision === "valider"
                                ? "border-green-200 text-green-700 ml-2"
                                : "border-gray-200 text-gray-700 ml-2"
                            }
                          >
                            Décision: {bill.conference_decision.decision === "valider" ? "Validée" : "Déclassée"}
                          </Badge>
                        )}
                        {bill.study_bureau_analysis && (
                          <Badge variant="outline" className="border-blue-200 text-blue-700 ml-2">
                            Analysée
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                        {bill.exposer || "Aucun exposé des motifs fourni"}
                      </p>
                      {bill.piece && (
                        <a
                          href={bill.piece}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          <Download className="inline h-4 w-4 mr-1" />
                          Télécharger la pièce jointe
                        </a>
                      )}
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
                      {(bill.etat === 0 || bill.etat === 1) && user?.role === "président" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleValidateBill(bill.id, "valider")}
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-500 text-gray-700"
                            onClick={() => handleValidateBill(bill.id, "declasser")}
                          >
                            <X className="mr-1 h-3 w-3" />
                            Déclasser
                          </Button>
                        </div>
                      )}
                      {(bill.etat === 0 || bill.etat === 1) && user?.role === "président" && (
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

      <Dialog open={decisionDialog} onOpenChange={setDecisionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Décision avec observations</DialogTitle>
            <DialogDescription>
              Valider ou déclasser: {selectedBill?.sujet}
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
                onClick={() => handleValidateBill(selectedBill?.id, "declasser")}
                variant="outline"
                className="flex-1 border-gray-500 text-gray-700"
              >
                <X className="mr-2 h-4 w-4" />
                Déclasser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedBill && !decisionDialog && (
        <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedBill.sujet}</DialogTitle>
              <DialogDescription>
                Proposition de loi par {selectedBill.author_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Code</Label>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedBill.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">État</Label>
                  <Badge className={getStatusColor(selectedBill.etat)}>
                    {getStatusDisplayName(selectedBill.etat)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Exposé des motifs</Label>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedBill.exposer || "Aucun exposé des motifs fourni"}
                  </p>
                </div>
              </div>
              {selectedBill.piece && (
                <div>
                  <Label className="text-sm font-medium">Pièce jointe</Label>
                  <a
                    href={selectedBill.piece}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    <Download className="inline h-4 w-4 mr-1" />
                    Télécharger
                  </a>
                </div>
              )}
              {selectedBill.conference_decision && (
                <div>
                  <Label className="text-sm font-medium">Décision de la conférence</Label>
                  <div
                    className={`p-4 rounded-lg mt-2 ${
                      selectedBill.conference_decision.decision === "valider"
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-gray-50 dark:bg-gray-900/20"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedBill.conference_decision.decision === "valider" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="font-medium">
                        {selectedBill.conference_decision.decision === "valider" ? "Validée" : "Déclassée"}
                      </span>
                      <span className="text-sm text-gray-500">
                        le {format(new Date(selectedBill.conference_decision.date), "dd MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    {selectedBill.conference_decision.observations && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedBill.conference_decision.observations}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {selectedBill.study_bureau_analysis && (
                <div>
                  <Label className="text-sm font-medium">Analyse du Bureau d'Études</Label>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-2">
                    <div className="flex items-center space-x-2 mb-2">
                      {selectedBill.study_bureau_analysis.avis === "Oui" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="font-medium">Avis: {selectedBill.study_bureau_analysis.avis}</span>
                      <span className="text-sm text-gray-500">
                        le {format(new Date(selectedBill.study_bureau_analysis.date), "dd MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedBill.study_bureau_analysis.justification || "Aucune justification fournie"}
                    </p>
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
