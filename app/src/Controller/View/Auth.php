<?php

declare(strict_types=1);

namespace App\Controller\View;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class Auth extends AbstractController
{
    #[Route('/login', name: 'app_login', methods: ['GET'])]
    public function login(Request $request, SessionInterface $session): Response
    {
        $jwtToken = $request->cookies->get('jwt_token');
        $userId = $session->get('user');

        if (empty($jwtToken) || empty($userId)) {
            $session->remove('user');
            return $this->render('auth/login.html.twig');
        }

        return $this->redirectToRoute('screen');
    }

    #[Route('/register', name: 'app_register', methods: ['GET'])]
    public function register(Request $request, SessionInterface $session): Response
    {
        $jwtToken = $request->cookies->get('jwt_token');
        $userId = $session->get('user');

        if ($jwtToken && $userId) {
            return $this->redirectToRoute('screen');
        }

        return $this->render('auth/register.html.twig');
    }
}
