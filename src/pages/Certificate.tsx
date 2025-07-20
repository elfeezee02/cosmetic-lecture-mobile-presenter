import { MobileLayout } from "@/components/MobileLayout";
import { CertificateComponent } from "@/components/CertificateComponent";

const Certificate = () => {
  return (
    <MobileLayout title="Certificate" showBackButton={true}>
      <div className="p-4">
        <CertificateComponent />
      </div>
    </MobileLayout>
  );
};

export default Certificate;
