<?php

namespace Zmc\ImageBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Zmc\ImageBundle\Form\FileUploadType;
use Zmc\ImageBundle\Form\Handler\HandlerInterface;

/**
 * Class ImageController
 * @package Zmc\ImageBundle\Controller
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
class ImageController extends Controller
{
    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        $key = $request->get('unique_key');
        if (!$request->getSession()->get($key)) {
            return new Response('Key was not found.');
        }

        $settings = $request->getSession()->get($key);

        if (!$this->container->has($settings['handler'])) {
            return new Response('Handler was not found.');
        }

        $form = $this->createForm(new FileUploadType(), array(), $settings['options']);

        if ($request->isMethod('post')) {
            $form->handleRequest($request);
            if ($form->isValid()) {
                /* @var $handler HandlerInterface */
                $handler = $this->container->get($settings['handler']);
                $data = $form->getData();

                $outputData = $handler->upload($data['file'], $settings['handler_options']);

                if ($settings['imagine_filter']) {
                    $outputData['preview_path'] = $this->get('liip_imagine.cache.manager')->getBrowserPath($outputData['web_path'], $settings['imagine_filter']);
                }

                return new JsonResponse($outputData);
            }
        }


        return $this->render('ZmcImageBundle:Image:index.html.twig', array(
            'form' => $form->createView(),
            'unique_key' => $key,
        ));
    }
}
