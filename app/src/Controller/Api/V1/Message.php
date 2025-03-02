<?php

namespace App\Controller\Api\V1;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class Message extends AbstractController
{
    #[Route('/api/v1/message', name: 'api_message_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        LoggerInterface $logger,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        if (empty($data['message'])) {
            return new JsonResponse(['error' => 'No message provided'], 400);
        }
//        $messageEntity = new Message();
//        $messageEntity->setContent($data['message']);
//        $messageEntity->setCreatedAt(new \DateTime());
//        $em->persist($messageEntity);
//        $em->flush();

        $logger->info(sprintf('Created message: %s', $data['message']));

        return new JsonResponse(['status' => 'Message stored successfully'], 201);
    }
}
