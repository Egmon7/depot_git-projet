import React, { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Vote,
  CheckCircle,
  XCircle,
  Minus,
  Clock,
  Users,
  BarChart3,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const PlenaryVoting = () => {
  const { user } = useAuth();
  const { bills, deputies, activePlenary, castVote } = useLegislative();
  const [userVote, setUserVote] = useState<"oui" | "non" | "abstention" | null>(
    null,
  );
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

  const currentBill = activePlenary
    ? bills.find((b) => b.id === activePlenary.billId)
    : null;
  const votes = currentBill?.votes || [];

  // Check if user has already voted
  const existingVote = votes.find((v) => v.deputyId === user?.id);

  useEffect(() => {
    if (existingVote) {
      setUserVote(existingVote.vote);
    }
  }, [existingVote]);

  // Timer countdown effect
  useEffect(() => {
    if (!activePlenary?.isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activePlenary?.isActive, timeRemaining]);

  const handleVote = (vote: "oui" | "non" | "abstention") => {
    if (!activePlenary?.isActive || !currentBill || timeRemaining <= 0) {
      toast({
        title: "Vote impossible",
        description: "La session de vote n'est pas active ou est terminée.",
        variant: "destructive",
      });
      return;
    }

    castVote(currentBill.id, vote);
    setUserVote(vote);

    toast({
      title: "Vote enregistré",
      description: `Votre vote "${vote}" a été enregistré avec succès.`,
    });
  };

  const voteStats = {
    oui: votes.filter((v) => v.vote === "oui").length,
    non: votes.filter((v) => v.vote === "non").length,
    abstention: votes.filter((v) => v.vote === "abstention").length,
    total: votes.length,
    remaining: deputies.filter((d) => d.statut).length - votes.length,
  };

  const totalDeputies = deputies.filter((d) => d.statut).length;
  const participationRate =
    totalDeputies > 0 ? (voteStats.total / totalDeputies) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!activePlenary || !currentBill) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session plénière</h1>
          <p className="text-gray-600 mt-1">Vote des propositions de loi</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune session de vote active
            </h3>
            <p className="text-gray-600">
              Attendez qu'une session plénière soit ouverte par le Président de
              l'Assemblée.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Session plénière en cours
        </h1>
        <p className="text-gray-600 mt-1">Vote de la proposition de loi</p>
      </div>

      {/* Session Status */}
      <Alert
        className={
          timeRemaining > 60
            ? "border-green-200 bg-green-50"
            : "border-orange-200 bg-orange-50"
        }
      >
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>
              Session de vote {activePlenary.isActive ? "active" : "fermée"} -
              Temps restant: <strong>{formatTime(timeRemaining)}</strong>
            </span>
            <Badge variant={timeRemaining > 60 ? "default" : "destructive"}>
              {timeRemaining > 0 ? "En cours" : "Terminé"}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Proposition en discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {currentBill.sujet}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Sujet:</span>{" "}
                    {currentBill.sujet}
                  </div>
                  <div>
                <span className="font-medium">Auteur:</span>{" "}
                  {currentBill.author_name}  // ✅ Correction
                </div>

                <div>
  <span className="font-medium">Déposée le:</span>{" "}
  {format(new Date(currentBill.date_depot), "dd MMMM yyyy", {
    locale: fr,
  })}
</div>

                  <div>
                    <span className="font-medium">Statut:</span>
                    <Badge className="ml-2">En plénière</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Exposé des motifs:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{currentBill.exposer}</p>
                </div>
              </div>

              {currentBill.study_bureau_analysis && (
                <div>
                  <h3 className="font-medium mb-2">
                    Résumé de l'analyse du Bureau d'Études:
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center space-x-2">
                      {currentBill.study_bureau_analysis.avis === "Oui" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        {currentBill.study_bureau_analysis.avis  === "Oui"
                          ? "Juridiquement correcte"
                          : "Problèmes juridiques identifiés"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {currentBill.study_bureau_analysis.avis === "Oui" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <span className="text-sm">
                        {currentBill.study_bureau_analysis.avis  === "Oui"
                          ? "Proposition originale"
                          : "Similitudes avec propositions existantes"}
                      </span>
                    </div>
                    {currentBill.study_bureau_analysis.justification && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <strong>Observations:</strong>{" "}
                          {currentBill.study_bureau_analysis.date}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voting Interface */}
          <Card>
            <CardHeader>
              <CardTitle>Votre vote</CardTitle>
              <CardDescription>
                Choisissez votre position sur cette proposition de loi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.role === "député" ? (
                <div className="space-y-4">
                  {existingVote ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Vous avez déjà voté:{" "}
                        <strong>{existingVote.vote.toUpperCase()}</strong>
                        <br />
                        <span className="text-sm text-gray-600">
                          Vote enregistré le{" "}
                          {format(
                            new Date(existingVote.timestamp),
                            "dd/MM/yyyy à HH:mm",
                            { locale: fr },
                          )}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      {timeRemaining > 0 && activePlenary.isActive ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button
                            onClick={() => handleVote("oui")}
                            className="h-16 bg-green-600 hover:bg-green-700"
                            disabled={!!existingVote}
                          >
                            <CheckCircle className="mr-2 h-6 w-6" />
                            <div>
                              <div className="font-semibold">OUI</div>
                              <div className="text-xs">Pour la proposition</div>
                            </div>
                          </Button>

                          <Button
                            onClick={() => handleVote("non")}
                            className="h-16 bg-red-600 hover:bg-red-700"
                            disabled={!!existingVote}
                          >
                            <XCircle className="mr-2 h-6 w-6" />
                            <div>
                              <div className="font-semibold">NON</div>
                              <div className="text-xs">
                                Contre la proposition
                              </div>
                            </div>
                          </Button>

                          <Button
                            onClick={() => handleVote("abstention")}
                            variant="outline"
                            className="h-16"
                            disabled={!!existingVote}
                          >
                            <Minus className="mr-2 h-6 w-6" />
                            <div>
                              <div className="font-semibold">ABSTENTION</div>
                              <div className="text-xs">Ne se prononce pas</div>
                            </div>
                          </Button>
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>
                            Le temps de vote est écoulé ou la session est
                            fermée.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Seuls les députés peuvent participer au vote.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Résultats en temps réel
              </CardTitle>
              <CardDescription>Décompte des votes exprimés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-green-700">
                      OUI
                    </span>
                    <span className="text-sm font-bold text-green-700">
                      {voteStats.oui}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalDeputies > 0
                        ? (voteStats.oui / totalDeputies) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-red-700">
                      NON
                    </span>
                    <span className="text-sm font-bold text-red-700">
                      {voteStats.non}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalDeputies > 0
                        ? (voteStats.non / totalDeputies) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      ABSTENTION
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {voteStats.abstention}
                    </span>
                  </div>
                  <Progress
                    value={
                      totalDeputies > 0
                        ? (voteStats.abstention / totalDeputies) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Participation:</span>
                  <span className="font-medium">
                    {participationRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Votes exprimés:</span>
                  <span className="font-medium">
                    {voteStats.total} / {totalDeputies}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>En attente:</span>
                  <span className="font-medium">{voteStats.remaining}</span>
                </div>
              </div>

              {voteStats.total > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2">
                    Tendance actuelle:
                  </h4>
                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    {voteStats.oui > voteStats.non ? (
                      <div className="text-green-700">
                        <CheckCircle className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">Favorable</span>
                      </div>
                    ) : voteStats.non > voteStats.oui ? (
                      <div className="text-red-700">
                        <XCircle className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">Défavorable</span>
                      </div>
                    ) : (
                      <div className="text-gray-700">
                        <Minus className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-sm font-medium">Égalité</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {voteStats.total}
                </div>
                <div className="text-sm text-gray-600">
                  députés ont voté sur {totalDeputies}
                </div>
                <Progress value={participationRate} className="mt-3" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlenaryVoting;
