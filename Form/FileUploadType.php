<?php

namespace Zmc\ImageBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Class FileUploadType
 * @package Zmc\ImageBundle\Form
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
class FileUploadType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $attributes = array(
            'accept' => $options['accept_file_type']
        );

        if ($options['allow_multiple']) {
            $attributes['multiple'] = 'multiple';
        }

        $builder
            ->add('file', 'file', array(
                'attr' => $attributes,
            ))
        ;
    }

    /**
     * {@inheritDoc}
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setRequired(array(
            'accept_file_type',
            'allow_multiple',
            'allow_crop',
        ));

        $resolver->setDefaults(array(
            'csrf_protection' => false,
            'crop_by_size' => null,
            'crop_by_ratio' => null,
        ));
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'file_upload';
    }
}