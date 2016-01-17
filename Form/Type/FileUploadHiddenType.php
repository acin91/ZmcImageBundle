<?php

namespace Zmc\ImageBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * Class ImageType
 * @package Zmc\ImageBundle\Form\Type
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
class FileUploadHiddenType extends AbstractType
{
    /**
     * @var SessionInterface
     */
    private $session;

    /**
     * ImageType constructor.
     * @param SessionInterface $session
     */
    public function __construct(SessionInterface $session)
    {
        $this->session = $session;
    }

    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        return 'hidden';
    }


    /**
     * {@inheritDoc}
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setRequired(array(
            'save_path',
            'web_path'
        ));

        $resolver->setDefaults(array(
            'handler' => 'zmc_image.form.handler.upload',
            'accept_file_type' => 'image/*',
            'imagine_filter' => null
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $uniqueKey = md5(microtime().rand());
        $sessionData = array(
            'handler' => $options['handler'],
            'imagine_filter' => $options['imagine_filter'],
            'options' => array(
                'accept_file_type' => $options['accept_file_type'],
            ),
            'handler_options' => array(
                'save_path' => $options['save_path'],
                'web_path'  => $options['web_path'],
            )
        );

        $this->session->set($uniqueKey, $sessionData);
        $this->session->save();

        $view->vars['unique_key'] = $uniqueKey;
        $view->vars['imagine_filter'] = $options['imagine_filter'];
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'file_upload_hidden';
    }
}