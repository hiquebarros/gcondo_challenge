import type {
    CreateQuote,
    ListQuoteCategories,
    ListQuoteStatuses,
    ListQuotes,
} from '@services/contracts/Quote.contract';
import { Request } from '@services/Request';

export const listQuotes = (): Promise<ListQuotes.Response> =>
    Request.get('/quotes');

export const createQuote = (body: CreateQuote.Body): Promise<CreateQuote.Response> =>
    Request.post('/quotes', body);

export const listQuoteCategories = (): Promise<ListQuoteCategories.Response> =>
    Request.get('/quote-categories');

export const listQuoteStatuses = (): Promise<ListQuoteStatuses.Response> =>
    Request.get('/quote-statuses');
