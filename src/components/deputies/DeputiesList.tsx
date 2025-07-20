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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  Mail,
  MapPin,
  TrendingUp,
  FileText,
  BarChart3,
} from "lucide-react";

const DeputiesList = () => {
  const { deputies } = useLegislative();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [filterConstituency, setFilterConstituency] = useState("all");
  const [filterGender, setFilterGender] = useState("all");

  const filteredDeputies = deputies.filter((deputy) => {
    const matchesSearch =
      deputy.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deputy.postnom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deputy.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup =
      filterGroup === "all" || deputy.groupe_parlementaire === filterGroup;
    const matchesConstituency =
      filterConstituency === "all" ||
      deputy.circonscription === filterConstituency;
    const matchesGender =
      filterGender === "all" || deputy.sexe === filterGender;

    return (
      matchesSearch && matchesGroup && matchesConstituency && matchesGender
    );
  });

  const uniqueGroups = [...new Set(deputies.map((d) => d.groupe_parlementaire))];
  const constituencies = ["Funa", "Mont Amba", "Lukunga", "Tshangu"];

  const stats = {
    total: deputies.length,
    active: deputies.filter((d) => d.statut ).length,
    byGender: {
      homme: deputies.filter((d) => d.sexe === "homme").length,
      femme: deputies.filter((d) => d.sexe === "femme").length,
    },
    byConstituency: constituencies.reduce(
      (acc, c) => {
        acc[c] = deputies.filter((d) => d.circonscription === c).length;
        return acc;
      },
      {} as Record<string, number>,
    ),
    avgParticipation: Math.round(
      deputies.reduce((acc, d) => acc + d.participationRate, 0) /
        deputies.length,
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Députés de l'Assemblée
        </h1>
        <p className="text-gray-600 mt-1">
          Gestion et suivi des membres de l'assemblée législative
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total députés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-gray-600">{stats.active} actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Répartition par genre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hommes:</span>
                <span className="font-medium">{stats.byGender.homme}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Femmes:</span>
                <span className="font-medium">{stats.byGender.femme}</span>
              </div>
              <div className="text-xs text-gray-600">
                {((stats.byGender.femme / stats.total) * 100).toFixed(1)}% de
                femmes
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Participation moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {stats.avgParticipation}%
                </div>
                <p className="text-xs text-gray-600">aux sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Groupes parlementaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{uniqueGroups.length}</div>
                <p className="text-xs text-gray-600">groupes actifs</p>
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
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un député..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Groupe parlementaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les groupes</SelectItem>
                {uniqueGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterConstituency}
              onValueChange={setFilterConstituency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Circonscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les circonscriptions</SelectItem>
                {constituencies.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="homme">Hommes</SelectItem>
                <SelectItem value="femme">Femmes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredDeputies.length} député(s) trouvé(s)
          </div>
        </CardContent>
      </Card>

      {/* Deputies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeputies.map((deputy) => (
          <Card key={deputy.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {deputy.nom} {deputy.postnom}
                  </h3>

                  <div className="space-y-2 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{deputy.email}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{deputy.circonscription}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {deputy.groupe_parlementaire}
                      </Badge>
                      <Badge
                        variant={deputy.statut  ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {deputy.statut  ? "Actif" : "Inactif"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          deputy.sexe === "homme"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-pink-50 text-pink-700"
                        }`}
                      >
                        {deputy.sexe === "homme" ? "H" : "F"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {deputy.billsProposed}
                  </div>
                  <div className="text-xs text-gray-600">Propositions</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${
                      deputy.participationRate >= 80
                        ? "text-green-600"
                        : deputy.participationRate >= 60
                          ? "text-orange-600"
                          : "text-red-600"
                    }`}
                  >
                    {deputy.participationRate}%
                  </div>
                  <div className="text-xs text-gray-600">Participation</div>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir les propositions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeputies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun député trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche ou filtres.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Constituency Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Répartition par circonscription
          </CardTitle>
          <CardDescription>
            Distribution géographique des députés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {constituencies.map((constituency) => (
              <div
                key={constituency}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl font-bold text-blue-600">
                  {stats.byConstituency[constituency] || 0}
                </div>
                <div className="text-sm font-medium">{constituency}</div>
                <div className="text-xs text-gray-600">
                  {(
                    ((stats.byConstituency[constituency] || 0) / stats.total) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeputiesList;
