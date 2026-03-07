<?php

namespace App\Services;

use App\Http\Error\HttpConflictException;
use App\Http\Error\HttpNotFoundException;
use App\Http\Error\HttpUnprocessableEntityException;
use App\Models\Person;

class PersonService
{
    /**
     * List people with optional filters (case insensitive, LIKE / partial match).
     *
     * @param array{full_name?: string, cpf?: string, email?: string} $filters
     */
    public function list(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Person::query();

        $fullName = $filters['full_name'] ?? '';
        $cpf = $filters['cpf'] ?? '';
        $email = $filters['email'] ?? '';

        if ($fullName !== '') {
            $query->whereRaw('LOWER(full_name) LIKE ?', ['%' . mb_strtolower($fullName) . '%']);
        }
        if ($cpf !== '') {
            $query->whereRaw('LOWER(cpf) LIKE ?', ['%' . mb_strtolower($cpf) . '%']);
        }
        if ($email !== '') {
            $query->whereRaw('LOWER(email) LIKE ?', ['%' . mb_strtolower($email) . '%']);
        }

        return $query->get();
    }

    public function find(int $id): Person
    {
        $person = Person::find($id);

        if (!$person) {
            throw new HttpNotFoundException('Person not found');
        }

        return $person;
    }

    public function create(array $data): Person
    {
        $this->validatePersonData($data);
        $this->ensureCpfNotDuplicate($data['cpf']);

        $person = Person::create([
            'full_name' => $data['full_name'],
            'cpf' => $this->normalizeCpf($data['cpf']),
            'email' => $data['email'],
            'birth_date' => $data['birth_date']
        ]);

        return $person;
    }

    public function update(int $id, array $data): Person
    {
        $person = $this->find($id);

        $this->validatePersonData($data);
        $this->ensureCpfNotDuplicate($data['cpf'], $id);

        $person->fill([
            'full_name' => $data['full_name'],
            'cpf' => $this->normalizeCpf($data['cpf']),
            'email' => $data['email'],
            'birth_date' => $data['birth_date']
        ]);

        $person->save();

        return $person;
    }

    public function delete(int $id): bool
    {
        $person = $this->find($id);

        return $person->delete();
    }

    /** @throws HttpUnprocessableEntityException */
    private function validatePersonData(array $data): void
    {
        if (empty(trim($data['full_name'] ?? ''))) {
            throw new HttpUnprocessableEntityException('Full name is required');
        }

        if (empty(trim($data['cpf'] ?? ''))) {
            throw new HttpUnprocessableEntityException('CPF is required');
        }

        if (empty(trim($data['email'] ?? ''))) {
            throw new HttpUnprocessableEntityException('Email is required');
        }

        if (empty($data['birth_date'] ?? '')) {
            throw new HttpUnprocessableEntityException('Birth date is required');
        }

        $birthDate = $data['birth_date'];
        if (strtotime($birthDate) === false) {
            throw new HttpUnprocessableEntityException('Invalid birth date format');
        }
    }

    /** @throws HttpConflictException */
    private function ensureCpfNotDuplicate(string $cpf, ?int $excludeId = null): void
    {
        $normalized = $this->normalizeCpf($cpf);
        $query = Person::where('cpf', $normalized);

        if ($excludeId !== null) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw new HttpConflictException('CPF já registrado');
        }
    }

    private function normalizeCpf(string $cpf): string
    {
        return preg_replace('/\D/', '', $cpf);
    }
}
