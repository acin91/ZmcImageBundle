<?php

namespace Zmc\ImageBundle\Form\Handler;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Class AbstractUploadHandler
 * @package Zmc\ImageBundle\Form\Handler
 * @author Zmicier Aliakseyeu <z.aliakseyeu@gmail.com>
 */
class UploadHandler implements HandlerInterface
{
    /**
     * @var string
     */
    private $kernelRootDir;

    /**
     * AbstractUploadHandler constructor.
     * @param string $kernelRootDir
     */
    public function __construct($kernelRootDir)
    {
        $this->kernelRootDir = $kernelRootDir;
    }

    /**
     * {@inheritdoc}
     */
    public function upload(UploadedFile $file, array $options)
    {
        $this->preUpload($file, $options);

        // Generate a unique name for the file before saving it
        $fileName = md5(uniqid()).'.'.$file->guessExtension();

        // Move the file to the directory where uploads are stored
        $uploadDir = $this->kernelRootDir . $options['save_path'];
        $file->move($uploadDir, $fileName);

        $this->postUpload($file, $options);

        return array(
            'save_path' => $uploadDir.DIRECTORY_SEPARATOR.$fileName,
            'web_path' => $options['web_path'].'/'.$fileName,
            'preview_path' => $options['web_path'].'/'.$fileName,
        );
    }

    /**
     * @param UploadedFile $file
     * @param array $options
     */
    public function preUpload(UploadedFile $file, array $options)
    {

    }

    /**
     * @param UploadedFile $file
     * @param array $options
     */
    public function postUpload(UploadedFile $file, array $options)
    {

    }
}