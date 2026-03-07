<?php

namespace App\Services;

use App\Http\Error\HttpUnauthorizedException;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService
{
    private const JWT_ALG = 'HS256';
    private const JWT_EXP_DAYS = 7;

    public function __construct(private string $jwtSecret) {}

    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !password_verify($password, $user->password_hash)) {
            throw new HttpUnauthorizedException('E-mail ou senha inválidos.');
        }

        $now = new \DateTimeImmutable();
        $expiresAt = $now->modify('+' . self::JWT_EXP_DAYS . ' days');

        $payload = [
            'sub' => (string) $user->id,
            'iat' => $now->getTimestamp(),
            'exp' => $expiresAt->getTimestamp(),
        ];

        $token = JWT::encode($payload, $this->jwtSecret, self::JWT_ALG);

        return [
            'user' => $user->toArray(),
            'token' => $token,
            'expires_at' => $expiresAt->format(\DateTimeInterface::ATOM),
        ];
    }

    /**
     * Decode JWT and return payload or null if invalid/expired.
     *
     * @return array{sub: string}|null
     */
    public function decodeToken(string $jwt): ?array
    {
        try {
            $decoded = JWT::decode($jwt, new Key($this->jwtSecret, self::JWT_ALG));
            $payload = (array) $decoded;
            if (empty($payload['sub'])) {
                return null;
            }
            return ['sub' => (string) $payload['sub']];
        } catch (\Throwable) {
            return null;
        }
    }

    public function getUserFromToken(string $jwt): ?User
    {
        $payload = $this->decodeToken($jwt);
        if ($payload === null) {
            return null;
        }
        $userId = (int) $payload['sub'];
        $user = User::find($userId);
        return $user instanceof User ? $user : null;
    }
}
