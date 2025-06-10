import React from "react";
import { useLegislative } from "@/contexts/LegislativeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  ArrowLeft,
  PieChart,
  Activity,
  Target,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getStatusDisplayName, getStatusColor } from "@/utils/permissions";

const Statistics = () => {
  const { bills, deputies, stats } = useLegislative();
  const navigate = useNavigate();

  if (!stats) {
    return <div>Chargement des statistiques...</div>;
  }

  const billsByGroup = deputies.reduce(
    (acc, deputy) => {
      const group = deputy.parlementaryGroup;
      acc[group] = (acc[group] || 0) + deputy.billsProposed;
      return acc;
    },
    {} as Record<string, number>,
  );

  const genderStats = {
    homme: deputies.filter((d) => d.gender === "homme").length,
    femme: deputies.filter((d) => d.gender === "femme").length,
  };

  const topDeputies = deputies
    .sort((a, b) => b.billsProposed - a.billsProposed)
    .slice(0, 5);

  const avgParticipation = Math.round(
    deputies.reduce((acc, d) => acc + d.participationRate, 0) / deputies.length,
  );

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
            Statistiques législatives
          </h1>
          <p className="text-gray-600 mt-1">
            Analyses détaillées de l'activité parlementaire
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total des lois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{stats.totalBills}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  propositions déposées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Députés actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {deputies.filter((d) => d.isActive).length}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  sur {deputies.length} total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Participation moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">{avgParticipation}%</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  aux sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Lois adoptées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold">
                  {stats.billsByStatus.adoptee || 0}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  succès législatifs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bills by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Répartition par statut
            </CardTitle>
            <CardDescription>
              État d'avancement des propositions de loi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.billsByStatus).map(([status, count]) => {
                const percentage =
                  stats.totalBills > 0 ? (count / stats.totalBills) * 100 : 0;
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(status)}>
                        {getStatusDisplayName(status)}
                      </Badge>
                      <span className="text-sm font-medium">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bills by Parliamentary Group */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Propositions par groupe parlementaire
            </CardTitle>
            <CardDescription>
              Activité législative par formation politique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(billsByGroup)
                .sort(([, a], [, b]) => b - a)
                .map(([group, count]) => {
                  const maxCount = Math.max(...Object.values(billsByGroup));
                  const percentage =
                    maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={group} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{group}</span>
                        <span className="text-sm">{count} proposition(s)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Top Deputies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Députés les plus actifs
            </CardTitle>
            <CardDescription>
              Classement par nombre de propositions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDeputies.map((deputy, index) => (
                <div
                  key={deputy.id}
                  className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {deputy.firstName} {deputy.lastName}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {deputy.parlementaryGroup}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {deputy.billsProposed} lois
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {deputy.participationRate}% participation
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Répartition géographique
            </CardTitle>
            <CardDescription>Activité par circonscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.billsByConstituency)
                .sort(([, a], [, b]) => b - a)
                .map(([constituency, count]) => {
                  const deputiesInConstituency = deputies.filter(
                    (d) => d.constituency === constituency,
                  ).length;
                  const avgPerDeputy =
                    deputiesInConstituency > 0
                      ? (count / deputiesInConstituency).toFixed(1)
                      : "0";
                  const maxCount = Math.max(
                    ...Object.values(stats.billsByConstituency),
                  );
                  const percentage =
                    maxCount > 0 ? (count / maxCount) * 100 : 0;

                  return (
                    <div key={constituency} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {constituency}
                        </span>
                        <span className="text-sm">
                          {count} lois ({avgPerDeputy}/député)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gender Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Analyse démographique
          </CardTitle>
          <CardDescription>
            Répartition par genre et statistiques diverses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {genderStats.homme}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Hommes
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {((genderStats.homme / deputies.length) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                {genderStats.femme}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Femmes
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {((genderStats.femme / deputies.length) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Object.keys(billsByGroup).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Groupes parlementaires
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                formations politiques
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Activité récente
          </CardTitle>
          <CardDescription>
            Dernières actions dans le processus législatif
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 border rounded-lg dark:border-gray-700"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.date.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
