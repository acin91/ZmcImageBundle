<?php

namespace Zmc\ImageBundle;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;
use Zmc\ImageBundle\DependencyInjection\Compiler\FormTemplateCompilerPass;

/**
 * Class ZmcImageBundle
 * @package Zmc\ImageBundle
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
class ZmcImageBundle extends Bundle
{
    /**
     * {@inheritdoc}
     */
    public function build(ContainerBuilder $container)
    {
        parent::build($container);
        $container->addCompilerPass(new FormTemplateCompilerPass());
    }
}
