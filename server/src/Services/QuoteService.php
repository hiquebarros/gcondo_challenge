<?php

namespace App\Services;

use App\Http\Error\HttpNotFoundException;
use App\Http\Error\HttpUnprocessableEntityException;
use App\Models\Condominium;
use App\Models\Quote;
use App\Models\QuoteCategory;
use App\Models\QuoteStatus;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class QuoteService
{
    /**
     * @param array{quote_category_id?: string, quote_status_id?: string, condominium_id?: string, supplier_id?: string} $filters
     */
    public function list(User $user, array $filters = []): Collection
    {
        $query = Quote::query()
            ->with(['condominium', 'supplier', 'quoteCategory', 'quoteStatus'])
            ->orderByDesc('created_at');

        if (!$user->canSeeAllCondominiums()) {
            $condominiumIds = $user->condominiums()->pluck('condominiums.id');
            $query->whereIn('condominium_id', $condominiumIds);
        }

        $categoryId = trim($filters['quote_category_id'] ?? '');
        if ($categoryId !== '') {
            $query->where('quote_category_id', (int) $categoryId);
        }
        $statusId = trim($filters['quote_status_id'] ?? '');
        if ($statusId !== '') {
            $query->where('quote_status_id', (int) $statusId);
        }
        $condominiumId = trim($filters['condominium_id'] ?? '');
        if ($condominiumId !== '') {
            $query->where('condominium_id', (int) $condominiumId);
        }
        $supplierId = trim($filters['supplier_id'] ?? '');
        if ($supplierId !== '') {
            $query->where('supplier_id', (int) $supplierId);
        }

        return $query->get();
    }

    public function find(int $id, User $user): Quote
    {
        $quote = Quote::with(['condominium', 'supplier', 'quoteCategory', 'quoteStatus'])->find($id);
        if (!$quote) {
            throw new HttpNotFoundException('Orcamento nao encontrado');
        }
        $this->ensureUserCanAccessCondominium($user, (int) $quote->condominium_id);
        return $quote;
    }

    public function create(array $data, User $user): Quote
    {
        if (isset($data['amount']) && (is_string($data['amount']) || is_numeric($data['amount']))) {
            $data['amount'] = $this->parseAmountMasked(trim((string) $data['amount']));
        }
        $this->validateCreateData($data);

        $condominiumId = (int) $data['condominium_id'];
        $this->ensureUserCanAccessCondominium($user, $condominiumId);

        $supplier = Supplier::find($data['supplier_id'] ?? 0);
        if (!$supplier) {
            throw new HttpNotFoundException('Fornecedor nao encontrado');
        }

        $category = QuoteCategory::find($data['quote_category_id'] ?? 0);
        if (!$category) {
            throw new HttpNotFoundException('Categoria nao encontrada');
        }

        $status = QuoteStatus::find($data['quote_status_id'] ?? 0);
        if (!$status) {
            throw new HttpNotFoundException('Status nao encontrado');
        }

        $quote = Quote::create([
            'title' => trim((string) ($data['title'] ?? '')),
            'description' => trim((string) ($data['description'] ?? '')),
            'amount' => $data['amount'],
            'supplier_id' => $supplier->id,
            'condominium_id' => $condominiumId,
            'quote_category_id' => $category->id,
            'quote_status_id' => $status->id,
        ]);

        return $quote->load(['condominium', 'supplier', 'quoteCategory', 'quoteStatus']);
    }

    public function update(int $id, array $data, User $user): Quote
    {
        $quote = $this->find($id, $user);

        if (isset($data['amount']) && (is_string($data['amount']) || is_numeric($data['amount']))) {
            $data['amount'] = $this->parseAmountMasked(trim((string) $data['amount']));
        }
        $this->validateCreateData($data);

        $condominiumId = (int) $data['condominium_id'];
        $this->ensureUserCanAccessCondominium($user, $condominiumId);

        $supplier = Supplier::find($data['supplier_id'] ?? 0);
        if (!$supplier) {
            throw new HttpNotFoundException('Fornecedor nao encontrado');
        }
        $category = QuoteCategory::find($data['quote_category_id'] ?? 0);
        if (!$category) {
            throw new HttpNotFoundException('Categoria nao encontrada');
        }
        $status = QuoteStatus::find($data['quote_status_id'] ?? 0);
        if (!$status) {
            throw new HttpNotFoundException('Status nao encontrado');
        }

        $quote->update([
            'title' => trim((string) ($data['title'] ?? '')),
            'description' => trim((string) ($data['description'] ?? '')),
            'amount' => $data['amount'],
            'supplier_id' => $supplier->id,
            'condominium_id' => $condominiumId,
            'quote_category_id' => $category->id,
            'quote_status_id' => $status->id,
        ]);

        return $quote->load(['condominium', 'supplier', 'quoteCategory', 'quoteStatus']);
    }

    public function delete(int $id, User $user): bool
    {
        $quote = $this->find($id, $user);
        return (bool) $quote->delete();
    }

    private function validateCreateData(array $data): void
    {
        if (empty($data['condominium_id'])) {
            throw new HttpUnprocessableEntityException('Condominio e obrigatorio');
        }
        if (empty($data['supplier_id'])) {
            throw new HttpUnprocessableEntityException('Fornecedor e obrigatorio');
        }
        if (empty(trim((string) ($data['title'] ?? '')))) {
            throw new HttpUnprocessableEntityException('Titulo e obrigatorio');
        }
        if (!isset($data['description']) || trim((string) $data['description']) === '') {
            throw new HttpUnprocessableEntityException('Descricao do servico e obrigatoria');
        }
        $amount = $data['amount'] ?? null;
        if ($amount === '' || $amount === null) {
            throw new HttpUnprocessableEntityException('Valor e obrigatorio');
        }
        if (!is_numeric($amount) || (float) $amount < 0) {
            throw new HttpUnprocessableEntityException('Valor invalido');
        }
        if (empty($data['quote_category_id'])) {
            throw new HttpUnprocessableEntityException('Categoria e obrigatoria');
        }
        if (empty($data['quote_status_id'])) {
            throw new HttpUnprocessableEntityException('Status e obrigatorio');
        }
    }

    /**
     * Converte valor mascarado BR (ex.: 1.234,56) ou número para decimal em reais.
     * Aceita: "1.234,56", "80,00", "80.00". String só com dígitos é tratada como centavos (ex.: "8000" -> 80.00).
     */
    private function parseAmountMasked(string $value): ?string
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }
        // Tem separador decimal (ex.: 80,00 ou 80.00) -> reais já explícitos
        if (preg_match('/^\d+[.,]\d+$/', $value)) {
            return str_replace(',', '.', $value);
        }
        // Formato BR com milhar (ex.: 1.234,56)
        $lastComma = strrpos($value, ',');
        $lastDot = strrpos($value, '.');
        if ($lastComma !== false && ($lastDot === false || $lastComma > $lastDot)) {
            $intPart = str_replace('.', '', substr($value, 0, $lastComma));
            $decPart = substr($value, $lastComma + 1);
            $digits = preg_replace('/\D/', '', $intPart) . preg_replace('/\D/', '', $decPart);
            if ($digits === '') {
                return null;
            }
            $cents = (int) $digits;
            return number_format($cents / 100, 2, '.', '');
        }
        if ($lastDot !== false && ($lastComma === false || $lastDot > $lastComma)) {
            $intPart = str_replace(',', '', substr($value, 0, $lastDot));
            $decPart = substr($value, $lastDot + 1);
            $intPart = preg_replace('/\D/', '', $intPart);
            $decPart = preg_replace('/\D/', '', $decPart);
            if ($intPart === '' && $decPart === '') {
                return null;
            }
            return $intPart . '.' . str_pad(substr($decPart, 0, 2), 2, '0');
        }
        // Só dígitos = centavos (front pode enviar "8000" para 80,00)
        $digits = preg_replace('/\D/', '', $value);
        if ($digits === '') {
            return null;
        }
        return number_format((int) $digits / 100, 2, '.', '');
    }

    private function ensureUserCanAccessCondominium(User $user, int $condominiumId): void
    {
        if ($user->canSeeAllCondominiums()) {
            if (!Condominium::where('id', $condominiumId)->exists()) {
                throw new HttpNotFoundException('Condominio nao encontrado');
            }
            return;
        }
        $allowed = $user->condominiums()->where('condominiums.id', $condominiumId)->exists();
        if (!$allowed) {
            throw new HttpNotFoundException('Condominio nao encontrado ou sem permissao');
        }
    }
}
