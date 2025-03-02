<?php

declare(strict_types=1);

namespace App\Controller\Api;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class Api
{
    #[Route('/api', name: 'api', methods: ['GET'])]
    public function index(): Response
    {
        return new Response('Main api page - nothing here');
    }
}
