import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, Home } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

interface CertificateComponentProps {
  userName: string;
  courseName: string;
  onClose: () => void;
}

export const CertificateComponent = ({ userName, courseName, onClose }: CertificateComponentProps) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    // Create a canvas element for certificate generation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 120);

    // Decorative line
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 140);
    ctx.lineTo(600, 140);
    ctx.stroke();

    // Award text
    ctx.fillStyle = '#555';
    ctx.font = '20px serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 200);

    // Name
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 28px serif';
    ctx.fillText(userName, canvas.width / 2, 240);

    // Course completion text
    ctx.fillStyle = '#555';
    ctx.font = '20px serif';
    ctx.fillText('has successfully completed the', canvas.width / 2, 280);

    // Course name
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 24px serif';
    ctx.fillText(courseName, canvas.width / 2, 320);

    // Date
    ctx.fillStyle = '#555';
    ctx.font = '18px serif';
    ctx.fillText(`Completed on ${currentDate}`, canvas.width / 2, 400);

    // Academy name
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 20px serif';
    ctx.fillText('Cosmetic Production Academy', canvas.width / 2, 480);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userName.replace(/\s+/g, '_')}_Certificate.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <MobileLayout 
      showBackButton={true} 
      backTo="/dashboard"
      title="Certificate"
    >
      <div className="p-4">
        <Card className="border-4 border-primary/20 shadow-xl">
          <CardContent className="p-6 text-center bg-gradient-to-br from-background to-accent/5">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-primary">
                  CERTIFICATE OF COMPLETION
                </h1>
                <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
              </div>

              {/* Content */}
              <div className="space-y-4 text-base">
                <p className="text-muted-foreground">This is to certify that</p>
                
                <h2 className="text-2xl font-bold text-foreground">
                  {userName}
                </h2>
                
                <p className="text-muted-foreground">has successfully completed the</p>
                
                <h3 className="text-xl font-semibold text-primary">
                  {courseName}
                </h3>
                
                <p className="text-sm text-muted-foreground">
                  Demonstrating proficiency in cosmetic science, manufacturing processes,
                  safety standards, and industry regulations.
                </p>
                
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Issued on {currentDate}
                  </p>
                  <p className="text-base font-semibold text-primary mt-1">
                    Cosmetic Production Academy
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button onClick={handleDownload} size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button variant="outline" onClick={onClose} size="lg" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};