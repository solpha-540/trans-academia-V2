import api from './axiosConfig';

export interface PasswordOtpRequest {
  contact: string;
}

export interface PasswordResetRequest {
  otp: number;
  pwd: string;
  pwd_confirm: string;
  contact: string;
}

export interface PasswordOtpApiResponse {
  code?: number;
  message?: string;
  data?: {
    can_reset?: boolean;
    channel?: string;
    sms_status?: unknown;
  } | null;
}

export interface PasswordResetApiResponse {
  code?: number;
  message?: string;
  data?: null;
}

export const sendPasswordOtp = async (contact: string): Promise<{ data: PasswordOtpApiResponse }> => {
  return api.post('/user/web/password/otp', { contact } as PasswordOtpRequest);
};

export const resetPassword = async (payload: PasswordResetRequest): Promise<{ data: PasswordResetApiResponse }> => {
  return api.put('/user/web/passeword/put', payload);
};
