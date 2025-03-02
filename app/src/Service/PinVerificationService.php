<?php
declare(strict_types=1);

namespace App\Service;

use RuntimeException;
use SodiumException;

class PinVerificationService
{
    /**
     * @throws SodiumException
     */
    public function verifyPin(string $securityCode, string $encryptedMasterKeyBase64): bool
    {
        $encryptedMasterKey = base64_decode($encryptedMasterKeyBase64);

        $saltLength = SODIUM_CRYPTO_PWHASH_SALTBYTES;
        $nonceLength = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES;
        if (strlen($encryptedMasterKey) < ($saltLength + $nonceLength)) {

            throw new RuntimeException('Corrupted encrypted data');
        }
        $salt = substr($encryptedMasterKey, 0, $saltLength);
        $nonce = substr($encryptedMasterKey, $saltLength, $nonceLength);
        $ciphertext = substr($encryptedMasterKey, $saltLength + $nonceLength);
        $derivedKey = sodium_crypto_pwhash(
            SODIUM_CRYPTO_SECRETBOX_KEYBYTES,
            $securityCode,
            $salt,
            SODIUM_CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE,
            SODIUM_CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE
        );
        $decryptedMasterKey = sodium_crypto_secretbox_open($ciphertext, $nonce, $derivedKey);

        return false === (false === $decryptedMasterKey);
    }
}
