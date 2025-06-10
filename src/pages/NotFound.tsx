import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <Scale className="h-8 w-8 text-white" />
          </div>

          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page non trouvée
          </h1>

          <p className="text-gray-600 mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <div className="space-y-3">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page précédente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
