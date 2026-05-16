// types/midtrans.d.ts
export interface MidtransResponse {
  token: string
  redirect_url: string
}

export interface SnapPayResult {
  transaction_status: string
  order_id: string
  status_code: string
  transaction_id: string
}