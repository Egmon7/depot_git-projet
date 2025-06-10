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
import {
  FileText,
  Plus,
  Search,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Vote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MyBills = () => {
  const { user } = useAuth();
  const { getUserBills } = useLegislative();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const myBills = getUserBills(user?.id || "");

  const filteredBills = myBills.filter((bill) => {
    const matchesSearch =
      bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: myBills.length,
    en_attente: myBills.filter((b) => b.status === "en_attente").length,
    en_conference: myBills.filter((b) => b.status === "en_conference").length,
    au_bureau_etudes: myBills.filter((b) => b.status === "au_bureau_etudes")
      .length,
    validee: myBills.filter((b) => b.status === "validee").length,
    en_pleniere: myBills.filter((b) => b.status === "en_pleniere").length,
    adoptee: myBills.filter((b) => b.status === "adoptee").length,
    rejetee: myBills.filter((b) => b.status === "rejetee").length,
    declassee: myBills.filter((b) => b.status === "declassee").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Clock className="h-4 w-4" />;
      case "en_conference":
        return <Calendar className="h-4 w-4" />;
      case "au_bureau_etudes":
        return <FileText className="h-4 w-4" />;
      case "validee":
        return <CheckCircle className="h-4 w-4" />;
      case "en_pleniere":
        return <Vote className="h-4 w-4" />;
      case "adoptee":
        return <CheckCircle className="h-4 w-4" />;
      case "rejetee":
        return <XCircle className="h-4 w-4" />;
      case "declassee":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("all")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts.all}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("en_attente")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {statusCounts.en_attente}
            </div>
            <div className="text-xs text-gray-600">En attente</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("validee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.validee}
            </div>
            <div className="text-xs text-gray-600">Validées</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("adoptee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {statusCounts.adoptee}
            </div>
            <div className="text-xs text-gray-600">Adoptées</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("rejetee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.rejetee}
            </div>
            <div className="text-xs text-gray-600">Rejetées</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("declassee")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {statusCounts.declassee}
            </div>
            <div className="text-xs text-gray-600">Déclassées</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("en_pleniere")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {statusCounts.en_pleniere}
            </div>
            <div className="text-xs text-gray-600">En plénière</div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => setStatusFilter("au_bureau_etudes")}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {statusCounts.au_bureau_etudes}
            </div>
            <div className="text-xs text-gray-600">À analyser</div>
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
                  placeholder="Rechercher dans mes propositions..."
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

          <div className="mt-2 text-sm text-gray-600">
            {filteredBills.length} proposition(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <div className="space-y-4">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{bill.title}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Sujet:
                        </span>
                        <p className="text-sm">{bill.subject}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Déposée le:
                        </span>
                        <p className="text-sm">
                          {format(new Date(bill.createdAt), "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Dernière mise à jour:
                        </span>
                        <p className="text-sm">
                          {format(new Date(bill.updatedAt), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {bill.motives}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)}
                          <span className="ml-1">
                            {getStatusDisplayName(bill.status)}
                          </span>
                        </Badge>

                        {bill.conferenceDecision && (
                          <Badge
                            variant="outline"
                            className={
                              bill.conferenceDecision.decision === "valider"
                                ? "border-green-200 text-green-700"
                                : "border-red-200 text-red-700"
                            }
                          >
                            {bill.conferenceDecision.decision === "valider"
                              ? "Validée en conférence"
                              : "Déclassée en conférence"}
                          </Badge>
                        )}

                        {bill.studyBureauAnalysis && (
                          <Badge
                            variant="outline"
                            className="border-blue-200 text-blue-700"
                          >
                            Analysée par le Bureau d'Études
                          </Badge>
                        )}

                        {bill.finalResult && (
                          <Badge
                            className={
                              bill.finalResult.result === "adoptee"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {bill.finalResult.result === "adoptee"
                              ? "Adoptée"
                              : "Rejetée"}
                            ({bill.finalResult.oui} oui, {bill.finalResult.non}{" "}
                            non)
                          </Badge>
                        )}
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBill(bill)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{bill.title}</DialogTitle>
                            <DialogDescription>
                              Proposition déposée le{" "}
                              {format(
                                new Date(bill.createdAt),
                                "dd MMMM yyyy",
                                { locale: fr },
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="font-medium text-sm">
                                  Sujet:
                                </span>
                                <p className="text-sm text-gray-700">
                                  {bill.subject}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium text-sm">
                                  Statut actuel:
                                </span>
                                <Badge className={getStatusColor(bill.status)}>
                                  {getStatusDisplayName(bill.status)}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <span className="font-medium text-sm">
                                Exposé des motifs:
                              </span>
                              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                <p className="text-sm text-gray-700">
                                  {bill.motives}
                                </p>
                              </div>
                            </div>

                            {bill.conferenceDecision && (
                              <div>
                                <span className="font-medium text-sm">
                                  Décision de la conférence:
                                </span>
                                <div
                                  className={`p-4 rounded-lg mt-2 ${
                                    bill.conferenceDecision.decision ===
                                    "valider"
                                      ? "bg-green-50"
                                      : "bg-red-50"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 mb-2">
                                    {bill.conferenceDecision.decision ===
                                    "valider" ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="font-medium">
                                      {bill.conferenceDecision.decision ===
                                      "valider"
                                        ? "Validée"
                                        : "Déclassée"}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      le{" "}
                                      {format(
                                        new Date(bill.conferenceDecision.date),
                                        "dd MMM yyyy",
                                        { locale: fr },
                                      )}
                                    </span>
                                  </div>
                                  {bill.conferenceDecision.observations && (
                                    <p className="text-sm text-gray-700">
                                      {bill.conferenceDecision.observations}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {bill.studyBureauAnalysis && (
                              <div>
                                <span className="font-medium text-sm">
                                  Analyse du Bureau d'Études:
                                </span>
                                <div className="bg-blue-50 p-4 rounded-lg mt-2 space-y-3">
                                  <div>
                                    <h4 className="font-medium text-sm mb-1">
                                      Analyse du fond:
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                      {bill.studyBureauAnalysis.fundAnalysis}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm mb-1">
                                      Analyse de la forme:
                                    </h4>
                                    <p className="text-sm text-gray-700">
                                      {bill.studyBureauAnalysis.formAnalysis}
                                    </p>
                                  </div>
                                  <div className="flex space-x-4">
                                    <div className="flex items-center space-x-2">
                                      {bill.studyBureauAnalysis
                                        .isLegallyCorrect ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      )}
                                      <span className="text-sm">
                                        {bill.studyBureauAnalysis
                                          .isLegallyCorrect
                                          ? "Juridiquement correcte"
                                          : "Problèmes juridiques"}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {bill.studyBureauAnalysis.isOriginal ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-orange-600" />
                                      )}
                                      <span className="text-sm">
                                        {bill.studyBureauAnalysis.isOriginal
                                          ? "Proposition originale"
                                          : "Similitudes existantes"}
                                      </span>
                                    </div>
                                  </div>
                                  {bill.studyBureauAnalysis.observations && (
                                    <div>
                                      <h4 className="font-medium text-sm mb-1">
                                        Observations:
                                      </h4>
                                      <p className="text-sm text-gray-700">
                                        {bill.studyBureauAnalysis.observations}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {bill.finalResult && (
                              <div>
                                <span className="font-medium text-sm">
                                  Résultat du vote:
                                </span>
                                <div
                                  className={`p-4 rounded-lg mt-2 ${
                                    bill.finalResult.result === "adoptee"
                                      ? "bg-green-50"
                                      : "bg-red-50"
                                  }`}
                                >
                                  <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                      <div className="text-2xl font-bold text-green-600">
                                        {bill.finalResult.oui}
                                      </div>
                                      <div className="text-sm">OUI</div>
                                    </div>
                                    <div>
                                      <div className="text-2xl font-bold text-red-600">
                                        {bill.finalResult.non}
                                      </div>
                                      <div className="text-sm">NON</div>
                                    </div>
                                    <div>
                                      <div className="text-2xl font-bold text-gray-600">
                                        {bill.finalResult.abstention}
                                      </div>
                                      <div className="text-sm">ABSTENTION</div>
                                    </div>
                                  </div>
                                  <div className="text-center mt-3">
                                    <Badge
                                      className={
                                        bill.finalResult.result === "adoptee"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }
                                    >
                                      {bill.finalResult.result === "adoptee"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "Aucune proposition trouvée"
                  : "Aucune proposition déposée"}
              </h3>
              <p className="text-gray-600 mb-4">
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
    </div>
  );
};

export default MyBills;
