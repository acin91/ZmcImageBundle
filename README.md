ZmcImageBundle Documentation
==========================

**Basics**

* [Installation](#installation)
* [Usage](#usage)

<a name="installation"></a>

## Installation

### Step 1) Get the bundle

#### Simply use composer to install the bundle

    composer require zmc/image-bundle

### Step 2) Register new bundle

Place new line into AppKernel:

``` php
<?php
// app/AppKernel.php

public function registerBundles()
{
    $bundles = array(
        // ...
        new Zmc\ImageBundle\ZmcImageBundle(),
    );
    // ...
}
```

### Step 3) Import routing:
``` yml
# app/config/routing.yml

# some routes can go here...
zmc_image:
    resource: "@ZmcImageBundle/Resources/config/routing.xml"
    prefix:   /zmc-image

# ... and some can go here. It's doesen't matter

```

<a name="usage"></a>

## Usage

Firstly you need to create FormType class and just use our form type as field:

``` php
<?php
// src/Acme/DemoBundle/Form/Type/DemoType.php

// ...
/**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('image', 'file_upload_hidden', array(
            
                /* required parameters */
                'save_path' => '/../web/uploads',
                'web_path' => '/uploads',
                
                /* optional parameters */
                'imagine_filter' => 'thumb', // filter name configured for LiipImagineBundle
                
                // here provided default value, you can pass any service name which implements
                /* \Zmc\ImageBundle\Form\Handler\HandlerInterface */
                'handler' => 'zmc_image.form.handler.upload',  
            ))
        ;
    }
// ... 
```

