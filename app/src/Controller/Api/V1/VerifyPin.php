<?php
declare(strict_types=1);

namespace App\Controller\Api\V1;

use App\Entity\User;
use App\Service\PinVerificationService;
use RuntimeException;
use SodiumException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class VerifyPin extends AbstractController
{
    /**
     * @throws SodiumException
     */
    #[Route('/api/v1/verify-pin', methods: ['POST'])]
    public function verifyPin(Request $request, PinVerificationService $pinVerificationService): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['security_code'])) {
            return new JsonResponse(['error' => 'Security code not provided'], 400);
        }

        /** @var User $user */
        $user = $this->getUser();

        if (null === $user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }

        try {
            $decryptedMasterKey = $pinVerificationService->verifyPin($data['security_code'], $user->getEncryptedMasterKey());
        } catch (RuntimeException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }

        if (false === $decryptedMasterKey) {
            return new JsonResponse(['error' => 'Invalid security code'], 403);
        }

        $response = new JsonResponse(['status' => 'Security code verified']);
        $session = $request->getSession();
        $session->set('pin_verified', true);

        $response->headers->setCookie(
            new Cookie('pin_verified', '1', 0, '/', '', false, false)
        );

        return $response;
    }
}
