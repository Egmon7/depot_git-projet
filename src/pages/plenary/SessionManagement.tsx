import React, { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
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
import { Progress } from "@/components/ui/progress";
import {
  Vote,
  Calendar,
  Play,
  Square,
  Users,
  BarChart3,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Minus,
  Clock,
  Eye,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

const SessionManagement = () => {
  const {
    bills,
    deputies,
    activePlenary,
    startPlenary,
    endPlenary,
    addNotification,
  } = useLegislative();
  const navigate = useNavigate();

  const [selectedBill, setSelectedBill] = useState("");
  const [plenaryDate, setPlenaryDate] = useState("");
  const [convocationDialog, setConvocationDialog] = useState(false);
  const [resultsDialog, setResultsDialog] = useState(false);

  // Bills ready for plenary (validated and analyzed)
  const billsReadyForPlenary = bills.filter(
    (b) => b.status === "validee" && b.studyBureauAnalysis,
  );

  // Current voting bill
  const currentVotingBill = activePlenary
    ? bills.find((b) => b.id === activePlenary.billId)
    : null;
  const votes = currentVotingBill?.votes || [];

  const voteStats = {
    oui: votes.filter((v) => v.vote === "oui").length,
    non: votes.filter((v) => v.vote === "non").length,
    abstention: votes.filter((v) => v.vote === "abstention").length,
    total: votes.length,
    remaining: deputies.filter((d) => d.isActive).length - votes.length,
  };

  const totalDeputies = deputies.filter((d) => d.isActive).length;
  const participationRate =
    totalDeputies > 0 ? (voteStats.total / totalDeputies) * 100 : 0;

  // Completed votes (bills with final results)
  const completedVotes = bills.filter((b) => b.finalResult);

  const handleSchedulePlenary = () => {
    if (!selectedBill || !plenaryDate) {
      toast({
        title: "Erreur",
        description:
          "Veuillez sélectionner une loi et une date pour la plénière.",
        variant: "destructive",
      });
      return;
    }

    // Send notification to rapporteur to convoke deputies
    addNotification({
      recipientId: "3", // Rapporteur ID
      type: "pleniere",
      title: "Plénière programmée",
      message: `Plénière programmée pour le ${format(new Date(plenaryDate), "dd MMMM yyyy à HH:mm", { locale: fr })}. Veuillez convoquer les députés.`,
      isRead: false,
      metadata: {
        billId: selectedBill,
        meetingDate: new Date(plenaryDate),
        sender: "Président",
      },
    });

    toast({
      title: "Plénière programmée",
      description:
        "La séance plénière a été programmée et le rapporteur a été notifié pour convoquer les députés.",
    });

    setConvocationDialog(false);
    setSelectedBill("");
    setPlenaryDate("");
  };

  const handleStartVoting = (billId: string) => {
    startPlenary(billId);
    toast({
      title: "Vote démarré",
      description: "La session de vote est maintenant ouverte aux députés.",
    });
  };

  const handleEndVoting = () => {
    if (activePlenary) {
      endPlenary(activePlenary.billId);
      toast({
        title: "Vote terminé",
        description:
          "La session de vote a été clôturée et les résultats sont disponibles.",
      });
    }
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des sessions
          </h1>
          <p className="text-gray-600 mt-1">
            Programmation et conduite des sessions plénières
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Programmer une plénière
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {billsReadyForPlenary.length} loi(s) prête(s) pour le vote
            </p>
            <Dialog
              open={convocationDialog}
              onOpenChange={setConvocationDialog}
            >
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Programmer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Programmer une séance plénière</DialogTitle>
                  <DialogDescription>
                    Sélectionnez la loi à voter et la date de la séance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bill">Loi à voter</Label>
                    <Select
                      value={selectedBill}
                      onValueChange={setSelectedBill}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une loi..." />
                      </SelectTrigger>
                      <SelectContent>
                        {billsReadyForPlenary.map((bill) => (
                          <SelectItem key={bill.id} value={bill.id}>
                            {bill.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date et heure de la plénière</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={plenaryDate}
                      onChange={(e) => setPlenaryDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  <Button onClick={handleSchedulePlenary} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Programmer la plénière
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Vote className="mr-2 h-5 w-5" />
              Session active
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activePlenary ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">Vote en cours:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentVotingBill?.title}
                </p>
                <Button
                  onClick={handleEndVoting}
                  variant="destructive"
                  className="w-full"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Terminer le vote
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aucune session active
                </p>
                {billsReadyForPlenary.length > 0 && (
                  <div className="space-y-2">
                    <Select
                      value={selectedBill}
                      onValueChange={setSelectedBill}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une loi..." />
                      </SelectTrigger>
                      <SelectContent>
                        {billsReadyForPlenary.map((bill) => (
                          <SelectItem key={bill.id} value={bill.id}>
                            {bill.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() =>
                        selectedBill && handleStartVoting(selectedBill)
                      }
                      disabled={!selectedBill}
                      className="w-full"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Démarrer le vote
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Résultats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {completedVotes.length} vote(s) terminé(s)
            </p>
            <Dialog open={resultsDialog} onOpenChange={setResultsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir les résultats
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Résultats des votes</DialogTitle>
                  <DialogDescription>
                    Historique des sessions plénières terminées
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {completedVotes.map((bill) => (
                    <Card key={bill.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{bill.title}</h3>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {bill.finalResult?.oui || 0}
                            </div>
                            <div className="text-sm">OUI</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                              {bill.finalResult?.non || 0}
                            </div>
                            <div className="text-sm">NON</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">
                              {bill.finalResult?.abstention || 0}
                            </div>
                            <div className="text-sm">ABSTENTION</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge
                            className={
                              bill.finalResult?.result === "adoptee"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {bill.finalResult?.result === "adoptee"
                              ? "ADOPTÉE"
                              : "REJETÉE"}
                          </Badge>
                          {bill.finalResult?.date && (
                            <p className="text-xs text-gray-500 mt-1">
                              {format(
                                new Date(bill.finalResult.date),
                                "dd MMM yyyy",
                                { locale: fr },
                              )}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {completedVotes.length === 0 && (
                    <div className="text-center py-8">
                      <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Aucun vote terminé
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Current Session Details */}
      {activePlenary && currentVotingBill && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-700">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
              <Vote className="mr-2 h-5 w-5" />
              Session plénière en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bill Info */}
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {currentVotingBill.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Sujet:</strong> {currentVotingBill.subject}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Auteur:</strong> {currentVotingBill.authorName}
                </p>
                <div className="bg-white dark:bg-gray-800 p-3 rounded">
                  <p className="text-sm">{currentVotingBill.motives}</p>
                </div>
              </div>

              {/* Real-time Results */}
              <div>
                <h4 className="font-semibold mb-4">Résultats en temps réel</h4>
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

                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded">
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

                <Button
                  onClick={handleEndVoting}
                  variant="destructive"
                  className="w-full mt-4"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Clôturer le vote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bills Ready for Plenary */}
      <Card>
        <CardHeader>
          <CardTitle>Lois prêtes pour la plénière</CardTitle>
          <CardDescription>
            Propositions validées et analysées, en attente de programmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billsReadyForPlenary.length > 0 ? (
              billsReadyForPlenary.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{bill.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Par {bill.authorName}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700"
                      >
                        ✓ Validée en conférence
                      </Badge>
                      {bill.studyBureauAnalysis && (
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700"
                        >
                          ✓ Analysée par le Bureau d'Études
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedBill(bill.id);
                        setConvocationDialog(true);
                      }}
                    >
                      <Calendar className="mr-1 h-3 w-3" />
                      Programmer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStartVoting(bill.id)}
                      disabled={!!activePlenary}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Voter maintenant
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Aucune loi prête
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Les lois doivent être validées en conférence et analysées par
                  le Bureau d'Études.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionManagement;
