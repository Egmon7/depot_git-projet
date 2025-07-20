import React, { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Search,
  Eye,
  ArrowLeft,
  Download,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";

const MyBills = () => {
  const { user } = useAuth();
  const { getUserBills } = useLegislative();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const myBills = getUserBills(user?.id || "");
  const filteredBills = myBills.filter((bill) => {
    const matchesSearch =
      bill.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.etat === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: myBills.length,
    en_attente: myBills.filter((b) => b.etat === 0).length,
    en_conference: myBills.filter((b) => b.etat === 1).length,
    au_bureau_etudes: myBills.filter((b) => b.etat === 2).length,
    validee: myBills.filter((b) => b.etat === 3).length,
    en_pleniere: myBills.filter((b) => b.etat === 4).length,
    adoptee: myBills.filter((b) => b.etat === 5).length,
    rejetees: myBills.filter((b) => b.etat === 6).length,
    declassees: myBills.filter((b) => b.etat === 7).length,
  };

  return (
    <div className="space-y-6">
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
              Mes propositions de loi
            </h1>
            <p className="text-gray-600 mt-1">
              Suivi de toutes vos propositions déposées ({myBills.length} total)
            </p>
          </div>
        </div>
        <Button onClick={() => navigate("/dashboard/propose-bill")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle proposition
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("all")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("0")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.en_attente}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">En attente</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("1")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.en_conference}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">En conférence</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("2")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{statusCounts.au_bureau_etudes}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Au bureau d'études</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("3")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.validee}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Validées</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("4")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{statusCounts.en_pleniere}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">En plénière</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("5")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{statusCounts.adoptee}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Adoptées</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setStatusFilter("6")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.rejetees}</div>
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
                  placeholder="Rechercher dans mes propositions..."
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
            {filteredBills.length} proposition(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{bill.sujet}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Code:</span>
                        <p className="text-sm">{bill.code}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date de dépôt:</span>
                        <p className="text-sm">
                          {format(new Date(bill.date_depot), "dd MMMM yyyy", { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {bill.exposer || "Aucun exposé des motifs fourni"}
                      </p>
                    </div>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(bill.etat)}>
                          {getStatusDisplayName(bill.etat)}
                        </Badge>
                        {bill.conference_decision && (
                          <Badge
                            variant="outline"
                            className={
                              bill.conference_decision.decision === "valider"
                                ? "border-green-200 text-green-700"
                                : "border-gray-200 text-gray-700"
                            }
                          >
                            {bill.conference_decision.decision === "valider"
                              ? "Validée en conférence"
                              : "Déclassée en conférence"}
                          </Badge>
                        )}
                        {bill.study_bureau_analysis && (
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            Analysée par le Bureau d'Études
                          </Badge>
                        )}
                        {bill.final_result && (
                          <Badge
                            className={
                              bill.final_result.result === "adoptee"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {bill.final_result.result === "adoptee"
                              ? "Adoptée"
                              : "Rejetée"}
                            ({bill.final_result.nombre_oui} oui, {bill.final_result.nombre_non} non)
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBill(bill)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "Aucune proposition trouvée"
                  : "Aucune proposition déposée"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Essayez de modifier vos critères de recherche."
                  : "Vous n'avez pas encore déposé de proposition de loi."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => navigate("/dashboard/propose-bill")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Déposer votre première proposition
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {selectedBill && (
        <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedBill.sujet}</DialogTitle>
              <DialogDescription>
                Proposition déposée le {format(new Date(selectedBill.date_depot), "dd MMMM yyyy", { locale: fr })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-sm">Code:</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedBill.code}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">État actuel:</span>
                  <Badge className={getStatusColor(selectedBill.etat)}>
                    {getStatusDisplayName(selectedBill.etat)}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="font-medium text-sm">Exposé des motifs:</span>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedBill.exposer || "Aucun exposé des motifs fourni"}
                  </p>
                </div>
              </div>
              {selectedBill.piece && (
                <div>
                  <span className="font-medium text-sm">Pièce jointe:</span>
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
                  <span className="font-medium text-sm">Décision de la conférence:</span>
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
                  <span className="font-medium text-sm">Analyse du Bureau d'Études:</span>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-2 space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Avis:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedBill.study_bureau_analysis.avis}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Justification:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedBill.study_bureau_analysis.justification || "Aucune justification fournie"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Date:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {format(new Date(selectedBill.study_bureau_analysis.date), "dd MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {selectedBill.final_result && (
                <div>
                  <span className="font-medium text-sm">Résultat du vote:</span>
                  <div
                    className={`p-4 rounded-lg mt-2 ${
                      selectedBill.final_result.result === "adoptee"
                        ? "bg-emerald-50 dark:bg-emerald-900/20"
                        : "bg-gray-50 dark:bg-gray-900/20"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{selectedBill.final_result.nombre_oui}</div>
                        <div className="text-sm">OUI</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">{selectedBill.final_result.nombre_non}</div>
                        <div className="text-sm">NON</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">{selectedBill.final_result.nombre_abstention}</div>
                        <div className="text-sm">ABSTENTION</div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <Badge
                        className={
                          selectedBill.final_result.result === "adoptee"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-600 text-white"
                        }
                      >
                        {selectedBill.final_result.result === "adoptee"
                          ? "ADOPTÉE"
                          : "REJETÉE"}
                      </Badge>
                    </div>
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

export default MyBills;
