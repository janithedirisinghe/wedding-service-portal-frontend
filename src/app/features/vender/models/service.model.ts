export interface ServiceModel {
    // Core fields
    name: string;
    description: string;
    pricing: number; // keeping existing pricing field (maps to base price if pricingModel is FIXED)
    userId: number; // supplied on create

    // Extended DTO fields
    serviceId?: number;
    status?: string; // ACTIVE, INACTIVE, DRAFT
    pricingModel?: string; // FIXED, PER_HOUR, etc.
    advancePercentage?: number | null;
    discountPercent?: number | null;
    bookBeforeDays?: number | null;
    isAvailable?: boolean;
    serviceAreaType?: string; // LOCAL, NATIONAL, ONLINE, REMOTE
    cancellationPolicy?: string;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}

export interface ServiceByVendor {
    serviceId: number;
    name: string;
    description: string;
    pricing: number;
    vendorId?: number;
    userId?: number;
    status?: string;
    pricingModel?: string;
    advancePercentage?: number | null;
    discountPercent?: number | null;
    bookBeforeDays?: number | null;
    isAvailable?: boolean;
    serviceAreaType?: string;
    cancellationPolicy?: string;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
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