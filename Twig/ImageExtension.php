<?php

namespace Zmc\ImageBundle\Twig;

use Symfony\Component\Templating\EngineInterface;

class ImageExtension extends \Twig_Extension
{
    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        return array(
            new \Twig_SimpleFunction('upload_images_collection_widget', array($this, 'showCollectionWidget'), array('is_safe' => array('html'), 'needs_environment' => true)),
        );
    }

    /**
     * @param \Twig_Environment $environment
     * @param string $containerId
     * @param string $acceptedFiles
     * @return string
     */
    public function showCollectionWidget(\Twig_Environment $environment, $containerId, $acceptedFiles)
    {
        return $environment->render('ZmcImageBundle::collection_widget.html.twig', array(
            'images_container' => $containerId,
            'accepted_files' => $acceptedFiles,
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'zmc_image_extension';
    }
}