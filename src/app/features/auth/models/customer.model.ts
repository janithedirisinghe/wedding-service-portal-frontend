export interface Customer {
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface CustomerOTP {
  otp: string;
  email: string;
}
