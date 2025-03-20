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