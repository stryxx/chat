<?php

declare(strict_types=1);

namespace App\Controller\View;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class Chat extends AbstractController
{
    #[Route('/screen', name: 'screen', methods: ['GET'])]
    public function __invoke(): Response
    {
        return $this->render('chat/chat.html.twig');
    }
}
