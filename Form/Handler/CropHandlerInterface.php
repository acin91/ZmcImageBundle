<?php

namespace Zmc\ImageBundle\Form\Handler;

/**
 * Class CropHandlerInterface
 * @package Zmc\ImageBundle\Form\Handler
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
interface CropHandlerInterface
{
    /**
     * @param string $image
     * @param array $cropData
     */
    public function crop($image, array $cropData, array $options);
}