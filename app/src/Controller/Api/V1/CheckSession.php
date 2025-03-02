<?php

declare(strict_types=1);

namespace App\Controller\Api\V1;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CheckSession extends AbstractController
{
    #[Route('/api/v1/check-session', methods: ['GET'])]
    public function __invoke(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $verified = $session->has('pin_verified') && $session->get('pin_verified') === true;

        return new JsonResponse(['verified' => $verified]);
    }
}
