<?php

declare(strict_types=1);

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Authenticator\JWTAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class CustomJwtAuthenticator extends JWTAuthenticator
{
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        if ($request->hasSession()) {
            $request->getSession()->set('user', $token->getUser()->getId());
        }
        return parent::onAuthenticationSuccess($request, $token, $firewallName);
    }
}
