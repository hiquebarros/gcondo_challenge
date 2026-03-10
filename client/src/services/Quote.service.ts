import type {
    CreateQuote,
    DeleteQuote,
    FindQuote,
    ListQuoteCategories,
    ListQuoteStatuses,
    ListQuotes,
    QuoteFilter,
    UpdateQuote,
} from '@services/contracts/Quote.contract';
import { Request } from '@services/Request';

function filterToParams(filter: QuoteFilter): Record<string, string> {
    const params: Record<string, string> = {};
    if (filter.quote_category_id.trim()) params.quote_category_id = filter.quote_category_id.trim();
    if (filter.quote_status_id.trim()) params.quote_status_id = filter.quote_status_id.trim();
    if (filter.condominium_id.trim()) params.condominium_id = filter.condominium_id.trim();
    if (filter.supplier_id.trim()) params.supplier_id = filter.supplier_id.trim();
    return params;
}

export const listQuotes = (filter?: QuoteFilter): Promise<ListQuotes.Response> =>
    Request.get('/quotes', filter ? filterToParams(filter) : undefined);

export const findQuote = (id: number): Promise<FindQuote.Response> =>
    Request.get(`/quotes/${id}`);

export const createQuote = (body: CreateQuote.Body): Promise<CreateQuote.Response> =>
    Request.post('/quotes', body);

export const updateQuote = (id: number, body: UpdateQuote.Body): Promise<UpdateQuote.Response> =>
    Request.put(`/quotes/${id}`, body);

export const deleteQuote = (id: number): Promise<DeleteQuote.Response> =>
    Request.delete(`/quotes/${id}`);

export const listQuoteCategories = (): Promise<ListQuoteCategories.Response> =>
    Request.get('/quote-categories');

export const listQuoteStatuses = (): Promise<ListQuoteStatuses.Response> =>
    Request.get('/quote-statuses');
