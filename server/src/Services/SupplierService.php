<?php

namespace App\Services;

use App\Http\Error\HttpNotFoundException;
use App\Http\Error\HttpUnprocessableEntityException;
use App\Models\Supplier;

class SupplierService
{
    /**
     * @param array{legal_name?: string, cnpj?: string, email?: string, supplier_category_id?: string} $filters
     */
    public function list(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Supplier::query()->with(['category', 'people']);

        $legalName = trim($filters['legal_name'] ?? '');
        $cnpj = trim($filters['cnpj'] ?? '');
        $email = trim($filters['email'] ?? '');
        $categoryId = trim($filters['supplier_category_id'] ?? '');

        if ($legalName !== '') {
            $query->whereRaw('LOWER(legal_name) LIKE ?', ['%' . mb_strtolower($legalName) . '%']);
        }
        if ($cnpj !== '') {
            $query->whereRaw('LOWER(cnpj) LIKE ?', ['%' . mb_strtolower($cnpj) . '%']);
        }
        if ($email !== '') {
            $query->whereRaw('LOWER(email) LIKE ?', ['%' . mb_strtolower($email) . '%']);
        }
        if ($categoryId !== '') {
            $query->where('supplier_category_id', (int) $categoryId);
        }

        return $query->get();
    }

    public function find(int $id): Supplier
    {
        $supplier = Supplier::with(['category', 'people', 'address'])->find($id);

        if (!$supplier) {
            throw new HttpNotFoundException('Supplier not found');
        }

        return $supplier;
    }

    public function create(array $data): Supplier
    {
        $this->validateSupplierData($data);

        $supplier = Supplier::create([
            'legal_name' => $data['legal_name'],
            'trade_name' => $data['trade_name'] ?? null,
            'cnpj' => $this->normalizeCnpj($data['cnpj'] ?? ''),
            'email' => $data['email'],
            'supplier_category_id' => isset($data['supplier_category_id']) ? (int) $data['supplier_category_id'] : null,
        ]);

        if (!empty($data['person_ids']) && is_array($data['person_ids'])) {
            $supplier->people()->sync(array_map('intval', $data['person_ids']));
        }

        return $supplier->load(['category', 'people']);
    }

    public function update(int $id, array $data): Supplier
    {
        $supplier = $this->find($id);

        $this->validateSupplierData($data);

        $supplier->fill([
            'legal_name' => $data['legal_name'],
            'trade_name' => $data['trade_name'] ?? null,
            'cnpj' => $this->normalizeCnpj($data['cnpj'] ?? ''),
            'email' => $data['email'],
            'supplier_category_id' => isset($data['supplier_category_id']) ? (int) $data['supplier_category_id'] : null,
        ]);
        $supplier->save();

        $supplier->people()->sync(!empty($data['person_ids']) && is_array($data['person_ids']) ? array_map('intval', $data['person_ids']) : []);

        return $supplier->load(['category', 'people']);
    }

    public function delete(int $id): bool
    {
        $supplier = $this->find($id);
        $supplier->people()->detach();
        return $supplier->delete();
    }

    /** @throws HttpUnprocessableEntityException */
    private function validateSupplierData(array $data): void
    {
        if (empty(trim($data['legal_name'] ?? ''))) {
            throw new HttpUnprocessableEntityException('Razão social é obrigatória');
        }
        if (empty(trim($data['cnpj'] ?? ''))) {
            throw new HttpUnprocessableEntityException('CNPJ é obrigatório');
        }
        if (empty(trim($data['email'] ?? ''))) {
            throw new HttpUnprocessableEntityException('E-mail é obrigatório');
        }
    }

    private function normalizeCnpj(string $cnpj): string
    {
        return preg_replace('/\D/', '', $cnpj);
    }
}
