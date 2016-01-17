<?php

namespace Zmc\ImageBundle\DependencyInjection\Compiler;

use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Add a new twig.form.resources
 *
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
class FormTemplateCompilerPass implements CompilerPassInterface
{
    /**
     * {@inheritdoc}
     */
    public function process(ContainerBuilder $container)
    {
        $resources = $container->getParameter('twig.form.resources');

        foreach (array('form_type') as $template) {
            $resources[] = 'ZmcImageBundle::' . $template . '.html.twig';
        }

        $container->setParameter('twig.form.resources', $resources);
    }
}