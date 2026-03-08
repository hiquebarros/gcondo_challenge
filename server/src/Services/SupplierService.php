<?php

namespace App\Services;

use App\Http\Error\HttpNotFoundException;
use App\Http\Error\HttpUnprocessableEntityException;
use App\Models\Supplier;
use App\Models\SupplierAddress;

class SupplierService
{
    /**
     * @param array{legal_name?: string, cnpj?: string, email?: string, supplier_category_id?: string} $filters
     */
    public function list(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Supplier::query()->with(['category', 'people', 'address']);

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
        $this->validateAddressData($data['address'] ?? []);

        $address = $this->createOrUpdateAddress($data['address'] ?? []);

        $supplier = Supplier::create([
            'legal_name' => $data['legal_name'],
            'trade_name' => $data['trade_name'] ?? null,
            'cnpj' => $this->normalizeCnpj($data['cnpj'] ?? ''),
            'email' => $data['email'],
            'supplier_address_id' => $address?->id,
            'supplier_category_id' => isset($data['supplier_category_id']) ? (int) $data['supplier_category_id'] : null,
        ]);

        if (!empty($data['person_ids']) && is_array($data['person_ids'])) {
            $supplier->people()->sync(array_map('intval', $data['person_ids']));
        }

        return $supplier->load(['category', 'people', 'address']);
    }

    public function update(int $id, array $data): Supplier
    {
        $supplier = $this->find($id);

        $this->validateSupplierData($data);
        if (isset($data['address'])) {
            $this->validateAddressData($data['address']);
        }

        $address = isset($data['address']) ? $this->createOrUpdateAddress($data['address'], $supplier->supplier_address_id) : null;

        $supplier->fill([
            'legal_name' => $data['legal_name'],
            'trade_name' => $data['trade_name'] ?? null,
            'cnpj' => $this->normalizeCnpj($data['cnpj'] ?? ''),
            'email' => $data['email'],
            'supplier_address_id' => $address?->id ?? $supplier->supplier_address_id,
            'supplier_category_id' => isset($data['supplier_category_id']) ? (int) $data['supplier_category_id'] : null,
        ]);
        $supplier->save();

        $supplier->people()->sync(!empty($data['person_ids']) && is_array($data['person_ids']) ? array_map('intval', $data['person_ids']) : []);

        return $supplier->load(['category', 'people', 'address']);
    }

    public function delete(int $id): bool
    {
        $supplier = $this->find($id);
        $supplier->people()->detach();
        $addressId = $supplier->supplier_address_id;
        $deleted = $supplier->delete();
        if ($deleted && $addressId) {
            SupplierAddress::where('id', $addressId)->delete();
        }
        return $deleted;
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

    /** @throws HttpUnprocessableEntityException */
    private function validateAddressData(array $data): void
    {
        if (empty(trim($data['street'] ?? ''))) {
            throw new HttpUnprocessableEntityException('Endereço (logradouro) é obrigatório');
        }
        if (empty(trim($data['city'] ?? ''))) {
            throw new HttpUnprocessableEntityException('Cidade é obrigatória');
        }
        if (empty(trim($data['postal_code'] ?? ''))) {
            throw new HttpUnprocessableEntityException('CEP é obrigatório');
        }
        $postalCode = preg_replace('/\D/', '', $data['postal_code'] ?? '');
        if (strlen($postalCode) !== 8) {
            throw new HttpUnprocessableEntityException('CEP deve ter 8 dígitos');
        }
    }

    private function createOrUpdateAddress(array $data, ?int $existingAddressId = null): ?SupplierAddress
    {
        $payload = [
            'street' => trim($data['street'] ?? ''),
            'number' => trim($data['number'] ?? '') ?: null,
            'complement' => trim($data['complement'] ?? '') ?: null,
            'neighborhood' => trim($data['neighborhood'] ?? '') ?: null,
            'city' => trim($data['city'] ?? ''),
            'state' => trim($data['state'] ?? '') ?: null,
            'country' => trim($data['country'] ?? '') ?: null,
            'postal_code' => preg_replace('/\D/', '', $data['postal_code'] ?? '') ?: null,
        ];

        if ($existingAddressId) {
            $address = SupplierAddress::find($existingAddressId);
            if ($address) {
                $address->fill($payload);
                $address->save();
                return $address;
            }
        }

        return SupplierAddress::create($payload);
    }
}
