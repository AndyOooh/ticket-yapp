import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '@/lib/sdk';
import { Address } from 'viem';
import { FiatCurrencyString } from '@yodlpay/yapp-sdk';

interface CreateTicketParams {
  eventId: number;
  ownerAddress: Address;
  ownerEns?: string;
}

interface BuyTicketParams extends CreateTicketParams {
  priceAmount: number;
  priceCurrency: FiatCurrencyString;
  eventTitle: string;
}

const createTicket = async (params: CreateTicketParams) => {
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to create ticket');
  }

  return response.json();
};

export function useBuyTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: BuyTicketParams) => {
      // 1. Create unpaid ticket
      const ticket = await createTicket(params);

      // 2. Request payment via SDK
      const { txHash, chainId } = await sdk.requestPayment(params.ownerEns || params.ownerAddress, {
        amount: params.priceAmount,
        currency: params.priceCurrency,
        // memo: `Ticket #${ticket.id} for ${params.eventTitle}`,
        memo: ticket.id,
        // redirectUrl: `${window.location.origin}/tickets`,
      });

      // 3. Update ticket with payment info
      const updateResponse = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash, chainId }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update ticket payment info');
      }

      const responseData = await updateResponse.json();
      return responseData;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userTickets'] });
    },
  });
}
