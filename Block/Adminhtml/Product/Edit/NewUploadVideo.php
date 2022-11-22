<?php
/**
 * Copyright © PHPDigital, Inc. All rights reserved.
 */
namespace AlbertMage\ProductVideo\Block\Adminhtml\Product\Edit;

/**
 * @author Albert Shen <albertshen1206@gmail.com>
 */
class NewUploadVideo extends \Magento\ProductVideo\Block\Adminhtml\Product\Edit\NewVideo
{

    /**
     * Form preparation
     *
     * @return void
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    protected function _prepareForm()
    {
        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create([
            'data' => [
                'id' => 'new_video_form',
                'class' => 'admin__scope-old',
                'enctype' => 'multipart/form-data',
            ]
        ]);
        $form->setUseContainer($this->getUseContainer());
        $form->addField('new_video_messages', 'note', []);
        $fieldset = $form->addFieldset('new_video_form_fieldset', []);
        $fieldset->addField(
            '',
            'hidden',
            [
                'name' => 'form_key',
                'value' => $this->getFormKey(),
            ]
        );
        $fieldset->addField(
            'item_id',
            'hidden',
            []
        );
        $fieldset->addField(
            'file_name',
            'hidden',
            []
        );
        $fieldset->addField(
            'video_provider',
            'hidden',
            [
                'class' => 'edited-data',
                'name' => 'video_provider',
            ]
        );
        $fieldset->addField(
            'video_path',
            'hidden',
            [
                'name' => 'video_path',
            ]
        );
        $fieldset->addField(
            'video_type',
            'select',
            [
                'options' => ['upload' => __('Upload'), 'url' => __('Url')],
                'name' => 'video_type',
                'label' => __('Video Type'),
                'title' => __('Video Type'),
                'class' => 'video_type',
                'multiple' => 'false'
            ]
        );
        $fieldset->addField(
            'video',
            'file',
            array(
                'name' => 'video',
                'label' => __('Video'),
                'title' => __('Video'),
                'note' => 'Allow video type: mp4',
            )
        );
        $fieldset->addField(
            'video_url',
            'text',
            [
                'class' => 'edited-data validate-url',
                'label' => __('Url'),
                'title' => __('Url'),
                'required' => true,
                'name' => 'video_url',
                'note' => $this->getNoteVideoUrl(),
            ]
        );
        $fieldset->addField(
            'video_title',
            'text',
            [
                'class' => 'edited-data',
                'label' => __('Title'),
                'title' => __('Title'),
                'required' => true,
                'name' => 'video_title',
            ]
        );
        $fieldset->addField(
            'video_description',
            'textarea',
            [
                'class' => 'edited-data',
                'label' => __('Description'),
                'title' => __('Description'),
                'name' => 'video_description',
            ]
        );
        $fieldset->addField(
            'new_video_screenshot',
            'file',
            [
                'label' => __('Preview Image'),
                'title' => __('Preview Image'),
                'name' => 'image',
            ]
        );
        $fieldset->addField(
            'new_video_screenshot_preview',
            'button',
            [
                'class' => 'preview-image-hidden-input',
                'label' => '',
                'name' => '_preview',
            ]
        );
        $fieldset->addField(
            'new_video_get',
            'button',
            [
                'label' => '',
                'title' => 'Get Video Information',
                'name' => 'new_video_get',
                'value' => __('Get Video Information'),
                'class' => 'action-default'
            ]
        );
        $this->addMediaRoleAttributes($fieldset);
        $fieldset->addField(
            'new_video_disabled',
            'checkbox',
            [
                'class' => 'edited-data',
                'label' => __('Hide from Product Page'),
                'title' => __('Hide from Product Page'),
                'name' => 'disabled',
            ]
        );
        $this->setForm($form);
    }


    /**
     * Get widget options
     *
     * @return string
     */
    public function getWidgetOptions()
    {
        return $this->jsonEncoder->encode(
            [
                'saveVideoUrl' => $this->getUrl('catalog/product_gallery/upload'),
                'saveRemoteVideoUrl' => $this->getUrl('product_video/product_gallery/retrieveImage'),
                'saveVideo' => $this->getUrl('product_video_upload/file/upload'),
                'htmlId' => $this->getHtmlId(),
                'youTubeApiKey' => $this->mediaHelper->getYouTubeApiKey(),
                'videoSelector' => $this->videoSelector
            ]
        );
    }

}
