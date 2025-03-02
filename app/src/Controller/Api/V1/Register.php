<?php
declare(strict_types=1);

namespace App\Controller\Api\V1;

use App\Entity\User;
use App\Service\KeyGeneratorService;
use Doctrine\ORM\EntityManagerInterface;
use Random\RandomException;
use SodiumException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class Register extends AbstractController
{
    /**
     * @throws RandomException
     * @throws SodiumException
     */
    #[Route('/api/v1/register', name: 'api_register', methods: ['POST'])]
    public function __invoke(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        KeyGeneratorService $keyGenerator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (false === isset($data['username'], $data['password'], $data['security_code'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }
        $existingUser = $em->getRepository(User::class)->findOneBy(['username' => $data['username']]);

        if ($existingUser) {
            return new JsonResponse(['error' => 'User already exists'], 409);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);
        $keys = $keyGenerator->generateKeys($data['security_code']);
        $user->setPublicKey($keys['publicKey']);
        $user->setEncryptedPrivateKey($keys['encryptedPrivateKey']);
        $user->setEncryptedMasterKey($keys['encryptedMasterKey']);
        $em->persist($user);
        $em->flush();

        return new JsonResponse(['status' => 'User created'], 201);
    }
}
