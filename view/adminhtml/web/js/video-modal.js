/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'Magento_ProductVideo/js/video-modal',
    'jquery/ui',
    'Magento_Ui/js/modal/modal',
    'mage/translate',
    'mage/backend/tree-suggest',
    'mage/backend/validation',
    'newVideoDialog'
], function ($, productGallery) {
    'use strict';

    $.widget('mage.productGallery', productGallery, {

        /**
         * Open dialog for external video
         * @private
         */
        _onOpenDialog: function (e, imageData) {

            if (imageData['media_type'] === 'upload-video' || imageData['media_type'] === 'upload-video') {
                this.showModal();
            } else {
                this._superApply(arguments);
            }
        }

    });

    return $.mage.productGallery;
});
