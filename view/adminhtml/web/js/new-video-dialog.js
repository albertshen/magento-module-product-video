/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'Magento_ProductVideo/js/new-video-dialog',
    'Magento_PageBuilder/js/config'
], function ($, newVideoDialog, _config) {
    'use strict';

    $.widget('mage.newVideoDialog', newVideoDialog, {

        _videoSelector: '[name="video"]',

        _videoPathSelector: '[name="video_path"]',

        _videoTypeSelector: '[name="video_type"]',

        _videoFormSelector: '#new_video_form',

        _videoUrlSelector: '[name="video_url"]',

        _videoTitleSelector: '[name="video_title"]',

        _videoProviderSelector: '[name="video_provider"]',

        _videoUploader: null,

        _videoType: null,


        /**
         * Build widget
         * @private
         */
        _create: function () {
            //this._super();

            this._initVideoUploader();

            this._videoUploader.on('fileuploaddone', $.proxy(this._onFileUploadDone, this));

            this.element.find(this._videoTypeSelector).on('change', $.proxy(this._onVideoTypeChange, this));




            var imgs = _.values(this.element.closest(this.options.videoSelector).data('images')) || [],
                widget,
                uploader,
                tmp,
                i;

            this._gallery =  this.element.closest(this.options.videoSelector);

            for (i = 0; i < imgs.length; i++) {
                tmp = imgs[i];
                this._images[tmp.file] = tmp;

                if (tmp['media_type'] !== 'image') {
                    tmp.subclass = 'video-item';
                    this._addVideoClass(tmp.url);
                }
            }

            this._gallery.on('openDialog', $.proxy(this._onOpenDialog, this));
            this._bind();
            this.createVideoItemIcons();
            widget = this;
            uploader = this.element.find(this._videoPreviewInputSelector);
            uploader.on('change', this._onImageInputChange.bind(this));
            uploader.attr('accept', this._imageTypes.join(','));

            this.element.modal({
                type: 'slide',
                //appendTo: this._gallery,
                modalClass: 'mage-new-video-dialog form-inline',
                title: $.mage.__('New Video'),
                buttons: [
                    {
                        text: $.mage.__('Save'),
                        class: 'action-primary video-create-button',
                        click: $.proxy(widget._onCreate, widget)
                    },
                    {
                        text: $.mage.__('Cancel'),
                        class: 'video-cancel-button',
                        click: $.proxy(widget._onCancel, widget)
                    },
                    {
                        text: $.mage.__('Delete'),
                        class: 'video-delete-button',
                        click: $.proxy(widget._onDelete, widget)
                    },
                    {
                        text: $.mage.__('Save'),
                        class: 'action-primary video-edit',
                        click: $.proxy(widget._onUpdate, widget)
                    }
                ],

                /**
                 * @returns {null}
                 */
                opened: function () {
                    var roles,
                        file,
                        modalTitleElement,
                        imageData,
                        modal = widget.element.closest('.mage-new-video-dialog');

                    //Video upload function
                    widget._initUploadType();

                    if (widget._isUploadVideo()) {
                        if (widget.element.find('#video_url').val()) {
                            widget.element.find(widget._videoPathSelector).val(widget.element.find('#video_url').val());
                            widget._previewVideo(widget.element.find('#video_url').val());
                            widget.element.find('#video_url').val('');
                        }
                    } else {
                        widget.element.find('#video_url').focus();
                        widget._onGetVideoInformationEditClick();
                    }
                    //

                    roles = widget.element.find('.video_image_role');
                    roles.prop('disabled', false);
                    file = widget.element.find('#file_name').val();
                    modalTitleElement = modal.find('.modal-title');

                    if (!file) {
                        widget._blockActionButtons(true);

                        modal.find('.video-delete-button').hide();
                        modal.find('.video-edit').hide();
                        modal.find('.video-create-button').show();
                        roles.prop('checked', widget._gallery.find('.image.item:not(.removed)').length < 1);
                        modalTitleElement.text($.mage.__('New Video'));
                        widget._isEditPage = false;

                        return null;
                    }
                    widget._blockActionButtons(false);
                    modalTitleElement.text($.mage.__('Edit Video'));
                    widget._isEditPage = true;
                    imageData = widget._getImage(file);

                    if (!imageData) {
                        imageData = {
                            url: _.find(widget._gallery.find('.product-image'), function (image) {
                                return image.src.indexOf(file) > -1;
                            }).src
                        };
                    }

                    widget._onPreview(null, imageData.url, false);
                },

                /**
                 * Closed
                 */
                closed: function () {
                    widget._onClose();
                    widget.createVideoItemIcons();
                }
            });
            this.toggleButtons();

        },

        /**
         * Fired when click on update video
         * @private
         */
        _onUpdate: function () {
            this._super();

            if (this._isUploadVideo()) {
                var itemId = this.element.find(this._itemIdSelector).val();
                itemId = itemId.slice(1, itemId.length - 1);
                this._gallery.find('input[name*="' + itemId + '][video_url]"]').val(this.element.find(this._videoPathSelector).val());
            }
        },

        /**
         * @param {String} result
         * @param {String} file
         * @param {String} oldFile
         * @param {Function} callback
         * @private
         */
        _onImageLoaded: function (result, file, oldFile, callback) {
            var data;

            try {
                data = JSON.parse(result);
            } catch (e) {
                data = result;
            }

            if (this.element.find('#video_url').parent().find('.image-upload-error').length > 0) {
                this.element.find('.image-upload-error').remove();
            }

            if (data.errorcode || data.error) {
                this.element.find('#video_url').parent().append('<div class="image-upload-error">' +
                '<div class="image-upload-error-cross"></div><span>' + data.error + '</span></div>');

                return;
            }
            $.each(this.element.find(this._videoFormSelector).serializeArray(), function (i, field) {
                data[field.name] = field.value;
            });

            if (this._isUploadVideo()) {
                data['video_url'] = data['video_path'];
                data['media_type'] = 'upload-video';
            } else {
                data['media_type'] = 'external-video';
            }

            data.disabled = this.element.find(this._videoDisableinputSelector).attr('checked') ? 1 : 0;
            
            data.oldFile = oldFile;

            oldFile ?
                this._replaceImage(oldFile, data.file, data) :
                this._setImage(data.file, data);
            callback.call(0, data);
        },

        /**
         * On open dialog
         * @param {Object} e
         * @param {Object} imageData
         * @private
         */
        _onOpenDialog: function (e, imageData) {
            var formFields, flagChecked, file,
                modal = this.element.closest('.mage-new-video-dialog');

            if (imageData['media_type'] !== 'image') {
                this.imageData = imageData;
                modal.find('.video-create-button').hide();
                modal.find('.video-delete-button').show();
                modal.find('.video-edit').show();
                modal.createVideoPlayer({
                    reset: true
                }).createVideoPlayer('reset');

                formFields = modal.find(this._videoFormSelector).find('.edited-data');

                $.each(formFields, function (i, field) {
                    $(field).val(imageData[field.name]);
                });

                flagChecked = imageData.disabled > 0;
                modal.find(this._videoDisableinputSelector).prop('checked', flagChecked);

                file = modal.find('#file_name').val(imageData.file);

                $.each(modal.find('.video_image_role'), function () {
                    $(this).prop('checked', false).prop('disabled', false);
                });

                $.each(this._gallery.find('.image-placeholder').siblings('input:hidden'), function () {
                    var start, end, imageRole;

                    if ($(this).val() === file.val()) {
                        start = this.name.indexOf('[') + 1;
                        end = this.name.length - 1;
                        imageRole = this.name.substring(start, end);
                        modal.find('#new_video_form input[value="' + imageRole + '"]').prop('checked', true);
                    }
                });
            }

        },

        /**
         * Check form
         * @param {Function} callback
         */
        isValid: function (callback) {
            var videoForm = this.element.find(this._videoFormSelector),
                videoLoaded = true;

            this._blockActionButtons(true);

            if (this.element.find(this._videoProviderSelector).val() !== 'uploader') {
                this._videoUrlWidget.trigger('validate_video_url', $.proxy(function () {

                    videoForm.mage('validation', {

                        /**
                         * @param {jQuery} error
                         * @param {jQuery} element
                         */
                        errorPlacement: function (error, element) {
                            error.insertAfter(element);
                        }
                    }).on('highlight.validate', function () {
                        $(this).validation('option');
                    });

                    videoForm.validation();

                    if (this._videoRequestComplete === false) {
                        videoLoaded = false;
                    }

                    callback(videoForm.valid() && videoLoaded);
                }, this));
            } else {
                videoForm.validation();
                //console.log(videoForm.valid(), videoLoaded);
                callback(videoForm.valid() && videoLoaded);
            }

            this._blockActionButtons(false);
        },

        _initVideoUploader: function() {

            this._videoUploader = this.element.find(this._videoSelector);

            var url = this.options.saveVideo;
            this._videoUploader.fileupload({
                url : url,
                type : 'POST',
                autoUpload : true,
                acceptFileTypes : /(mp4|mov)$/i,
                maxNumberOfFiles : 1,
                messages : {
                    acceptFileTypes : '文件类型不匹配',
                    maxFileSize : '文件过大',
                    minFileSize : '文件过小'
                }
            });
        },

        /**
         * @private
         */
        _onFileUploadDone: function (e, data) {

            this.element.find(this._videoPathSelector).val(data.result.path);

            var filename = data.result.name.substring(0, data.result.name.lastIndexOf("."));
            this.element.find(this._videoTitleSelector).val(filename);

            this._previewVideo(data.result.path);        

            this._blockActionButtons(false);
        },

        _previewVideo: function(path) {

            var url = _config.getConfig("media_url") + path;
            var videoDom = '<div class="product-video responsive" data-width="100%" data-height="100%"><video frameborder="0" controls="" src="'+url+'" poster="" data-video-type="uploader" data-element="video"></video></div>';
            this.element.find('.video-player-container').html('').append(videoDom);
            this.element.find('.video-player-container').addClass('upload');
        },

        _initUploadType: function() {

            if(this.element.find(this._itemIdSelector).val()) {
                this.element.find('.field-video_type').hide();
                var videoProvider = this.element.find(this._videoProviderSelector).val();

                if (videoProvider === 'uploader') {
                    //this.element.find(this._videoTypeSelector).val('upload');
                    this.changeVideoTypeStatus('upload');
                } else if (videoProvider === 'url'){
                    //this.element.find(this._videoTypeSelector).val('url');
                    this.changeVideoTypeStatus('url');
                } else {
                    if (this.element.find(this._videoUrlSelector).val()) {
                        //this.element.find(this._videoTypeSelector).val('url');
                        this.changeVideoTypeStatus('url');
                    } 
                }
            } else {
                this.element.find('.field-video_type').show();
                this.element.find('.video-player-container').html('');
                this.changeVideoTypeStatus('upload');
            }
        },

        _isUploadVideo: function() {
            if (this.element.find(this._videoProviderSelector).val() === 'uploader') {
                return true;
            }
            return false;
        },

        /**
         * @private
         */
        _onVideoTypeChange: function () {
            if (this.element.find(this._videoTypeSelector).val() == 'upload') {
                this.element.find('#video_url').val('');
            }
            this.changeVideoTypeStatus(this.element.find(this._videoTypeSelector).val());
        },

        changeVideoTypeStatus: function(name) {
            var reqClass = 'required-entry _required';
            if (name === 'upload') {
                this.element.find(this._videoProviderSelector).val('uploader');
                this.element.find(this._videoUrlSelector).removeClass(reqClass);
                this.element.find('.field-video').addClass(reqClass).show();
                this.element.find('.field-video_url').removeClass(reqClass).hide();
                this.element.find('.field-new_video_get').hide();
            } else {
                this.element.find(this._videoProviderSelector).val('url');
                this.element.find(this._videoUrlSelector).addClass(reqClass);
                this.element.find('.field-video').hide();
                this.element.find('.field-video_url').show();
                this.element.find('.field-new_video_get').show();
                this.element.find('#video_url').focus();

                this.element.find('.video-player-container').removeClass('upload');
            }
        }




    });

    return $.mage.newVideoDialog;
});
