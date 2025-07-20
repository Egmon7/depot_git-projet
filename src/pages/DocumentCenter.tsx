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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Download,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Filter,
  Archive,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DocumentCenter = () => {
  const { user } = useAuth();
  const { bills } = useLegislative();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Transform bills into documents
  const documents = bills.map((bill) => ({
    id: bill.id,
    title: bill.sujet,
    type: "proposition_loi",
    status: bill.etat,
    author: bill.author_name,
    createdAt: bill.date_depot,
    updatedAt: bill.date_depot, // ou null si non disponible
    description: bill.exposer.substring(0, 150) + "...",
    category: bill.code,
    attachments: bill.piece ? [bill.piece] : [],
    hasAnalysis: !!bill.study_bureau_analysis,
    hasConferenceDecision: !!bill.conference_decision,
    hasVoteResults: !!bill.final_result,
  }));
  
  const statusMap: Record<string, number> = {
    en_attente: 0,
    en_conference: 1,
    au_bureau_etudes: 2,
    validee: 3,
    en_pleniere: 4,
    adoptee: 5,
    rejetee: 6,
    declassee: 7,
  };
  
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesStatus =
      statusFilter === "all" || doc.status === statusMap[statusFilter];
  
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
  
    return matchesSearch && matchesStatus && matchesType;
  });

  const documentStats = {
    total: documents.length,
    withAnalysis: documents.filter((d) => d.hasAnalysis).length,
    withDecision: documents.filter((d) => d.hasConferenceDecision).length,
    withResults: documents.filter((d) => d.hasVoteResults).length,
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "proposition_loi":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "analyse":
        return <FileText className="h-5 w-5 text-purple-600" />;
      case "decision":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "resultat":
        return <FileText className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "proposition_loi":
        return "Proposition de loi";
      case "analyse":
        return "Analyse";
      case "decision":
        return "Décision";
      case "resultat":
        return "Résultat de vote";
      default:
        return "Document";
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
              Centre de documents
            </h1>
            <p className="text-gray-600 mt-1">
              Accès aux documents législatifs et archives
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Archive className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{documentStats.total}</div>
                <p className="text-xs text-gray-600">disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avec analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {documentStats.withAnalysis}
                </div>
                <p className="text-xs text-gray-600">analysés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avec décision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {documentStats.withDecision}
                </div>
                <p className="text-xs text-gray-600">décisions prises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Votés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {documentStats.withResults}
                </div>
                <p className="text-xs text-gray-600">avec résultats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher des documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="proposition_loi">
                  Propositions de loi
                </SelectItem>
                <SelectItem value="analyse">Analyses</SelectItem>
                <SelectItem value="decision">Décisions</SelectItem>
                <SelectItem value="resultat">Résultats de vote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredDocuments.length} document(s) trouvé(s)
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getDocumentIcon(doc.type)}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {doc.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Type:
                            </span>
                            <p className="text-sm">{getTypeLabel(doc.type)}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Auteur:
                            </span>
                            <p className="text-sm">{doc.author}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Catégorie:
                            </span>
                            <p className="text-sm">{doc.category}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {doc.description}
                        </p>

                        <div className="flex items-center space-x-3 mb-3">
                          <Badge className={getStatusColor(doc.status)}>
                            {getStatusDisplayName(doc.status)}
                          </Badge>

                          {doc.hasAnalysis && (
                            <Badge
                              variant="outline"
                              className="border-purple-200 text-purple-700"
                            >
                              Analysé
                            </Badge>
                          )}

                          {doc.hasConferenceDecision && (
                            <Badge
                              variant="outline"
                              className="border-green-200 text-green-700"
                            >
                              Décision prise
                            </Badge>
                          )}

                          {doc.hasVoteResults && (
                            <Badge
                              variant="outline"
                              className="border-orange-200 text-orange-700"
                            >
                              Voté
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>
                              Créé le{" "}
                              {format(new Date(doc.createdAt), "dd MMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                            <span>
                              Mis à jour le{" "}
                              {format(new Date(doc.updatedAt), "dd MMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          </div>

                          {doc.attachments.length > 0 && (
                            <span>
                              {doc.attachments.length} pièce(s) jointe(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Consulter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche ou filtres.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Archive className="mr-2 h-5 w-5" />
            Catégories de documents
          </CardTitle>
          <CardDescription>
            Types de documents disponibles dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Propositions de loi</h4>
                  <p className="text-xs text-gray-600">
                    Textes originaux déposés par les députés avec exposé des
                    motifs
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Analyses techniques</h4>
                  <p className="text-xs text-gray-600">
                    Rapports d'analyse du fond et de la forme par le Bureau
                    d'Études
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">
                    Décisions de conférence
                  </h4>
                  <p className="text-xs text-gray-600">
                    Validations ou déclassements par la Conférence des
                    Présidents
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Résultats de vote</h4>
                  <p className="text-xs text-gray-600">
                    Comptes-rendus des sessions plénières avec détail des votes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentCenter;
