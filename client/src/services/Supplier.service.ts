import type { Supplier } from '@internal-types/Supplier.type';

import type {
    CreateSupplier,
    DeleteSupplier,
    FindSupplier,
    ListSupplierCategories,
    ListSuppliers,
    UpdateSupplier,
} from './contracts/Supplier.contract';
import { Request } from './Request';

export const listSupplierCategories = (): Promise<ListSupplierCategories.Response> =>
    Request.get('/supplier-categories');

function filterToParams(filter: Supplier.Filter): Record<string, string> {
    const cnpjDigits = (filter.cnpj ?? '').replace(/\D/g, '');
    const params: Record<string, string> = {
        legal_name: filter.legal_name,
        cnpj: cnpjDigits,
        email: filter.email,
        supplier_category_id: filter.supplier_category_id,
    };
    return params;
}

export const listSuppliers = (filter?: Supplier.Filter): Promise<ListSuppliers.Response> =>
    Request.get('/suppliers', filter ? filterToParams(filter) : undefined);

export const findSupplier = (id: Supplier.Model['id']): Promise<FindSupplier.Response> =>
    Request.get(`/suppliers/${id}`);

export const createSupplier = (body: CreateSupplier.Body): Promise<CreateSupplier.Response> =>
    Request.post('/suppliers', body);

export const updateSupplier = (
    id: Supplier.Model['id'],
    body: UpdateSupplier.Body,
): Promise<UpdateSupplier.Response> => Request.put(`/suppliers/${id}`, body);

export const deleteSupplier = (id: Supplier.Model['id']): Promise<DeleteSupplier.Response> =>
    Request.delete(`/suppliers/${id}`);
