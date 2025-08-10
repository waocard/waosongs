declare module '@paystack/inline-js' {
  interface PaystackPopConfig {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    onSuccess: (transaction: { reference: string }) => void;
    onClose: () => void;
  }

  export class PaystackPop {
    newTransaction(config: PaystackPopConfig): void;
  }
}
