if ('undefined' === typeof ImageUploader) {
    /**
     *
     * @param uniqueKey
     * @param inputId
     * @param uploadRoute
     * @param allowCrop
     * @param cropRoute
     * @param cropBy
     * @constructor
     */
    var ImageUploader = function(uniqueKey, inputId, uploadRoute, allowCrop, cropRoute, cropBy) {
        var modal = '[data-destination='+inputId+']';
        var modalForm = '[data-destination='+inputId+'] [role=form]';

        var uploadContainer     = modalForm + ' [data-role=upload-container]';
        var previewContainer    = modalForm + ' [data-role=preview-container]';
        var cropContainer       = modalForm + ' [data-role=crop-container]';

        var activeContainer = previewContainer;

        if (allowCrop) {
            activeContainer = cropContainer;
        }
        
        var destinationHiddenInput = '[container-for='+uniqueKey+'] input[type=hidden]#' + inputId;
        var removeImageBtn = modal + ' button[data-role=remove-image]';
        var cropSaveBtn = modal + ' button[data-role=crop-save]';
        var saveBtn = modal + ' button[data-role=save]';
        var uploadedImage = undefined;
        var currentImage = undefined;

        var hideContainers = function() {
            $(uploadContainer).hide();
            $(cropContainer).hide();
            $(previewContainer).hide();
        };

        /**
         * Process and store response after uploading
         *
         * @param data
         */
        var onImageUploaded = function(data) {
            uploadedImage = data;
            $(removeImageBtn).show();
        };

        /**
         * Save response data to destination field and set preview
         */
        var save = function() {
            var data = uploadedImage;

            var value = '';
            var preview = '';

            if (data && data['web_path'] && data['preview_path']) {
                value = data['web_path'];
                preview = '<img src="' + data['preview_path'] + '" />';
            }

            $(destinationHiddenInput).val(value);
            $('[image-role=container_'+inputId+'_'+uniqueKey+']').html(preview);
        };

        var jcrop_api;

        var cropSize, realSize, factor;

        /**
         *
         */
        var crop = function() {

            var filename;
            if (uploadedImage) {
                filename = uploadedImage['web_path'].replace(/^.*[\\\/]/, '');
            } else {
                filename = currentImage.replace(/^.*[\\\/]/, '');
            }

            var data = {
                'filename': filename
            };

            var coordinates = {};

            coordinates['x'] = $(cropContainer + ' input[name=crop_x_1]').val();
            coordinates['y'] = $(cropContainer + ' input[name=crop_y_1]').val();
            coordinates['w'] = $(cropContainer + ' input[name=crop_w]').val();
            coordinates['h'] = $(cropContainer + ' input[name=crop_h]').val();

            data['coordinates'] = coordinates;
            data['unique_key'] = uniqueKey;

            $.post(cropRoute, data, function(response) {
                uploadedImage = response;
                save();
            });
        };


        /**
         * Shows crop form
         *
         * @param imageUri
         */
        var showCrop = function(imageUri) {
            //alert(imageUri);
            hideContainers();
            $(cropContainer).show();
            $(cropContainer + ' img').attr('src', imageUri);

            $(cropContainer + ' > img').on('load', function() {
                cropSize = {
                    width: this.width,
                    height: this.height
                };
                $('<img src="' + imageUri + '" />').on('load', function() {
                    realSize = {
                        width: this.width,
                        height: this.height
                    };
                    factor = realSize.width / cropSize.width;
                });
            });

            var options = {
                onChange:   _updateCoords,
                onSelect:   _updateCoords,
                onRelease:  _clearCoords,
                addClass: 'jcrop-centered',
                boxWidth: 400,
                boxHeight: 400
            };

            if (cropBy['ratio'] > 0) {
                options['aspectRatio'] = cropBy['ratio'];
            } else if (cropBy['size']['w'] > 0 || cropBy['size']['h'] > 0) {
                options['setSelect'] = [0, 0, cropBy['size']['w'], cropBy['size']['h']];
                options['allowResize'] = false;
                options['aspectRatio'] = 1;
                options['minSize'] = [cropBy['size']['w'], cropBy['size']['h']];
                options['maxSize'] = [cropBy['size']['w'], cropBy['size']['h']];
            }

            $(cropContainer + ' img').Jcrop(options,function(){
                jcrop_api = this;
            });

            $(removeImageBtn).show();
            $(cropSaveBtn).show();
            $(saveBtn).hide();
        };

        var _updateCoords = function(coords) {
            $(cropContainer + ' input[name=crop_x_1]').val(coords.x * factor);
            $(cropContainer + ' input[name=crop_x_2]').val(coords.x2 * factor);
            $(cropContainer + ' input[name=crop_y_1]').val(coords.y * factor);
            $(cropContainer + ' input[name=crop_y_2]').val(coords.y2 * factor);
            $(cropContainer + ' input[name=crop_w]').val(coords.w * factor);
            $(cropContainer + ' input[name=crop_h]').val(coords.h * factor);
        };

        var _clearCoords = function() {
            $(cropContainer + ' input[type=hidden]').val('');
        };

        var unbindCrop = function() {
            jcrop_api.destroy();
            $(cropContainer + ' img').attr('style', '');
            hideContainers();
            $(cropSaveBtn).hide();
            $(saveBtn).show();
        };

        /**
         * Show preview in modal window
         *
         * @param imageUri
         */
        var showPreview = function(imageUri) {
            hideContainers();
            $(previewContainer + ' img').attr('src', imageUri);
            $(removeImageBtn).show();
        };

        var removeImage = function() {
            uploadedImage = undefined;
            $(activeContainer + ' img').attr('src', '');
            unbindCrop();
            hideContainers();
            $(removeImageBtn).hide();
            $(modalForm + ' input[type=file]').val(undefined);
            $(uploadContainer).show();
        };


        var progressProcessing = true;
        var fakePercentage = 0;

        var onProgressUpload = function(percentage) {
            //console.log(percentage);
            $(previewContainer + ' span[data-role=percentage-counter]').text(percentage + '%');
        };

        /**
         *
         * @param percentage
         * @param done
         */
        var animateUpload = function(percentage, done) {
            if (!progressProcessing) {
                return;
            }

            if (fakePercentage > percentage && percentage <= 49) {
                fakePercentage = percentage;
            }

            if (fakePercentage < percentage && percentage >= 49) {
                fakePercentage = 49;
            } else {
                fakePercentage = percentage;
            }

            setTimeout(onProgressUpload(fakePercentage), 50);

            if (percentage == 100 || done === true) {
                var percentageInterval = setInterval(function() {
                    onProgressUpload(fakePercentage);
                    fakePercentage += 2;
                    if (fakePercentage > 100) {
                        clearInterval(percentageInterval);
                        progressProcessing = false;
                    }
                }, 100);
            }

            if (fakePercentage == 100) {
                progressProcessing = false;
            }
        };

        /**
         * Binds modal input field for making preview, calling crop tool and so on
         */
        var bindForm = function() {
            $(uploadContainer).show();

            $(modalForm + ' input[type=file]').on('change', function() {
                hideContainers();
                $(previewContainer).show();

                /* !!! dynamic preview !!! */
                var fr = new FileReader();
                fr.onload = function(e) {
                    $(previewContainer + ' img').attr('src', this.result);
                };
                fr.readAsDataURL(this.files[0]);

                /* !!! end dynamic preview !!! */

                var formData = new FormData();

                var fileInputElement = this.files[0];
                var fieldName = $(modalForm + ' input[type=file]').attr('name');
                formData.append(fieldName, fileInputElement);

                fakePercentage = 0;
                progressProcessing = true;
                var action = $(modalForm).attr('action');
                var request = new XMLHttpRequest();
                request.open('POST', action);

                $(previewContainer + ' [data-role=percentage-overlay]').css('display', 'block');
                $(previewContainer + ' [data-role=percentage-counter]').css('display', 'block');
                request.upload.onprogress = function(e) {
                    var done = e.loaded || e.position, total = e.totalSize || e.total;
                    var percentage = Math.floor(done/total*1000)/10;

                    animateUpload(percentage);
                };

                request.onload = function(e) {
                    if (request.status == 200) {
                        var data = JSON.parse(request.response);
                        onImageUploaded(data);
                        animateUpload(100, true);

                        $(previewContainer + ' [data-role=percentage-overlay]').css('display', 'none');
                        $(previewContainer + ' [data-role=percentage-counter]').css('display', 'none');
                        if (allowCrop) {
                            showCrop(data['web_path']);
                        } else {
                            showPreview(data['web_path']);
                        }
                        //$(modal).modal('hide');
                    } else {
                        alert('error occurred!');
                    }
                };

                request.send(formData);
            });
        };

        /**
         * Binds all modal window based on destination input data and other stuff
         *
         * 1. hide all modes
         * 2. detect current mode based on data and is crop available
         * 3. call relevant methods
         *
         */
        var bindModal = function() {
            var currentValue = $(destinationHiddenInput).val();

            hideContainers();

            if (currentValue) {
                currentImage = currentValue;
            }

            if (currentValue && allowCrop) {
                showCrop(currentValue);
            } else if (currentValue && !allowCrop) {
                showPreview(currentValue);
            } else {
                bindForm();
            }

            $(removeImageBtn).on('click', function() {
                removeImage();
            });

            $(modal + ' button[data-role=save][data-unique-key=' + uniqueKey + ']').on('click', function() {
                save();
                $(modal).modal('hide');
            });

            $(modal + ' button[data-role=crop-save][data-unique-key=' + uniqueKey + ']').on('click', function() {
                crop();
                $(modal).modal('hide');
            });
        };


        jQuery(function($) {
            $(removeImageBtn).hide();
            $(cropSaveBtn).hide();

            $("[image-role=call-form-"+inputId+"]").on('click', function() {
                if ($('[data-destination='+inputId+']').length > 0 && $('[data-destination='+inputId+']').hasClass('modal')) {
                    $.get(uploadRoute, {'unique_key': uniqueKey}, function(response) {
                        $(modalForm).html(response);
                        $(modal).modal('show');

                        bindModal();
                    });
                }
            });

        });
    }
}