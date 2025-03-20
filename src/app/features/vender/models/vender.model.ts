export interface venderDetails{
  vendorId: number;
  businessName: string;
  availability: string | null;
  bio: string;
  telNo: string;
  services: Service[];
  admin: string | null;
  location: string;
  country: string;
  brn: string;
  venType: string;
}

export interface Service {
    serviceId: number;
    name: string | null;
    description: string | null;
    pricing: number | null;
  }