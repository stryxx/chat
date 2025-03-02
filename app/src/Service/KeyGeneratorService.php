<?php

declare(strict_types=1);

namespace App\Service;

use Random\RandomException;
use SodiumException;

class KeyGeneratorService
{
    /**
     * @throws RandomException
     * @throws SodiumException
     */
    public function generateKeys(string $securityCode): array
    {
        $keyPair = sodium_crypto_box_keypair();
        $publicKey = sodium_crypto_box_publickey($keyPair);
        $privateKey = sodium_crypto_box_secretkey($keyPair);
        $masterKey = random_bytes(SODIUM_CRYPTO_SECRETBOX_KEYBYTES);
        $salt1 = random_bytes(SODIUM_CRYPTO_PWHASH_SALTBYTES);
        $derivedKey1 = sodium_crypto_pwhash(
            SODIUM_CRYPTO_SECRETBOX_KEYBYTES,
            $securityCode,
            $salt1,
            SODIUM_CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE,
            SODIUM_CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE
        );
        $nonce1 = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $encryptedPrivateKey = $salt1 . $nonce1 . sodium_crypto_secretbox($privateKey, $nonce1, $derivedKey1);
        $salt2 = random_bytes(SODIUM_CRYPTO_PWHASH_SALTBYTES);
        $derivedKey2 = sodium_crypto_pwhash(
            SODIUM_CRYPTO_SECRETBOX_KEYBYTES,
            $securityCode,
            $salt2,
            SODIUM_CRYPTO_PWHASH_OPSLIMIT_INTERACTIVE,
            SODIUM_CRYPTO_PWHASH_MEMLIMIT_INTERACTIVE
        );
        $nonce2 = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
        $encryptedMasterKey = $salt2 . $nonce2 . sodium_crypto_secretbox($masterKey, $nonce2, $derivedKey2);

        return [
            'publicKey' => base64_encode($publicKey),
            'encryptedPrivateKey' => base64_encode($encryptedPrivateKey),
            'encryptedMasterKey' => base64_encode($encryptedMasterKey)
        ];
    }
}
