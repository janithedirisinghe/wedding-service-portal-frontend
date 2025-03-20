export interface Vender {
    email: string;
    username: string;
    password: string;
    role: string;
}

export interface OTP {
    otp: string;
    email: string;
}

export interface venderInfo {
    businessName: string;
    availability: string;
    location: string;
    brn: string;
    country: string;
    VenType: string;
    bio: string;
    telNo: string;
}