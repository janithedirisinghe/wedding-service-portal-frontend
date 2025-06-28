export interface ServiceModel {
    name: string;
    description: string;
    pricing: number;
    vendorId: number;
}

export interface ServiceByVendor {
    serviceId: number;
    name: string;
    description: string;
    pricing: number;
    vendorId: number;
}

export interface VenderProfile {
    VenderId : number;
    businessName: string;
    availability: string;
    Location: string;
    BRN: string;
    Country: string;
    venType : string;
    bio: string;
    telNo: string;
}