import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import DeputyDashboard from "./dashboard/DeputyDashboard";
import PresidentDashboard from "./dashboard/PresidentDashboard";
import RapporteurDashboard from "./dashboard/RapporteurDashboard";
import ConferenceDashboard from "./dashboard/ConferenceDashboard";
import StudyBureauDashboard from "./dashboard/StudyBureauDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "depute":
      return <DeputyDashboard />;
    case "president":
      return <PresidentDashboard />;
    case "rapporteur":
      return <RapporteurDashboard />;

    case "bureau_etudes":
      return <StudyBureauDashboard />;
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Rôle non reconnu
          </h2>
          <p className="text-gray-600 mt-2">
            Veuillez contacter l'administrateur.
          </p>
        </div>
      );
  }
};

export default Dashboard;
