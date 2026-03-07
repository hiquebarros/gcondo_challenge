<?php

namespace App\Services;

use App\Http\Error\HttpUnauthorizedException;
use App\Models\Session;
use App\Models\User;

class AuthService
{
    private const SESSION_COOKIE_NAME = 'session_id';
    private const SESSION_LIFETIME_DAYS = 7;

    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !password_verify($password, $user->password_hash)) {
            throw new HttpUnauthorizedException('E-mail ou senha inválidos.');
        }

        $this->invalidateUserSessions($user->id);

        $sessionToken = $this->generateToken();
        $csrfToken = $this->generateToken();
        $expiresAt = (new \DateTimeImmutable())->modify('+' . self::SESSION_LIFETIME_DAYS . ' days');

        Session::create([
            'user_id' => $user->id,
            'session_token' => $sessionToken,
            'csrf_token' => $csrfToken,
            'expires_at' => $expiresAt->format('Y-m-d H:i:s'),
        ]);

        return [
            'user' => $user->toArray(),
            'session_token' => $sessionToken,
            'csrf_token' => $csrfToken,
            'expires_at' => $expiresAt->format(\DateTimeInterface::ATOM),
        ];
    }

    public function logout(string $sessionToken): void
    {
        Session::where('session_token', $sessionToken)->delete();
    }

    public function getSessionFromToken(string $sessionToken): ?Session
    {
        $session = Session::with('user')->where('session_token', $sessionToken)->first();

        if (!$session || $session->isExpired()) {
            return null;
        }

        return $session;
    }

    public function validateCsrf(Session $session, string $csrfToken): bool
    {
        return hash_equals($session->csrf_token, $csrfToken);
    }

    public static function getSessionCookieName(): string
    {
        return self::SESSION_COOKIE_NAME;
    }

    private function invalidateUserSessions(int $userId): void
    {
        Session::where('user_id', $userId)->delete();
    }

    private function generateToken(): string
    {
        return bin2hex(random_bytes(32));
    }
}
