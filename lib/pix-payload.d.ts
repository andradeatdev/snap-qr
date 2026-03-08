declare module "pix-payload" {
  interface PixOptions {
    key: string;
    name: string;
    city: string;
    amount?: number;
    transactionId?: string;
  }

  export function payload(options: PixOptions): string;
}
