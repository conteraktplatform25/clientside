export function mapWhatsAppStatus(status: string): 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' {
  switch (status) {
    case 'sent':
      return 'SENT';
    case 'delivered':
      return 'DELIVERED';
    case 'read':
      return 'READ';
    default:
      return 'FAILED';
  }
}
