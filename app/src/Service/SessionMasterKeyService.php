<?php
declare(strict_types=1);

namespace App\Service;

use Random\RandomException;
use SodiumException;

class SessionMasterKeyService
{
    private string $serverKey;
    private int $nonceLength;

    public function __construct(string $serverSecret)
    {
        $this->serverKey = hash('sha256', $serverSecret, true);
        $this->nonceLength = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES;
    }

    /**
     * @throws RandomException
     * @throws SodiumException
     */
    public function encryptMasterKey(string $masterKey): string
    {
        $nonce = random_bytes($this->nonceLength);
        $ciphertext = sodium_crypto_secretbox($masterKey, $nonce, $this->serverKey);

        return base64_encode($nonce . $ciphertext);
    }

    /**
     * @throws SodiumException
     */
    public function decryptMasterKey(string $encryptedMasterKeyBase64): ?string
    {
        $encrypted = base64_decode($encryptedMasterKeyBase64);
        if (strlen($encrypted) < $this->nonceLength) {

            return null;
        }
        $nonce = substr($encrypted, 0, $this->nonceLength);
        $ciphertext = substr($encrypted, $this->nonceLength);
        $plaintext = sodium_crypto_secretbox_open($ciphertext, $nonce, $this->serverKey);
        if (false === $plaintext) {

            return null;
        }

        return $plaintext;
    }
}
