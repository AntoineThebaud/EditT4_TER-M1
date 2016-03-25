// Generated by CoffeeScript 1.9.3
(function() {
  window.Popup = (function() {
    function Popup() {}

    Popup.prototype.createCloseButton = function() {
      var $element;
      $element = this.createButton('Cancel');
      $element.addClass('close_button');
      return $element;
    };

    Popup.prototype.applyCloseButtonEvents = function($element, $popup) {
      return $element.on({
        click: (function(_this) {
          return function() {
            $popup.trigger('close');
            return $popup.popup('hide');
          };
        })(this)
      });
    };

    Popup.prototype.createBlock = function(title) {
      var $body, $header, $row;
      $header = $('<div></div>').addClass('col-xs-12 popup_block_title').text(title);
      $body = $('<div></div>').clone().addClass('body col-xs-12');
      $row = $('<div></div>').clone().addClass('row');
      $row.append([$header, $body]);
      return $row;
    };

    Popup.prototype.createInputText = function(classname, name_id) {
      var $element;
      $element = $('<input></input').attr('type', 'text').addClass('form-control');
      if ((classname != null)) {
        $element.addClass(classname);
      }
      if ((name_id != null)) {
        $element.attr({
          name: name_id,
          id: name_id
        });
      }
      $element.on('keypress', function(args) {
        var ref;
        if (args.keyCode === 13) {
          $(this).blur();
          return (ref = $(this).closest('.popup').find('.valid_button')) != null ? ref.click() : void 0;
        }
      });
      return $element;
    };

    Popup.prototype.createCheckbox = function(classname, name_id, state) {
      var $element;
      $element = $('<input></input').attr('type', 'checkbox');
      if ((classname != null)) {
        $element.addClass(classname);
      }
      if (state == null) {
        state = false;
      }
      $element.prop('checked', state);
      if ((name_id != null)) {
        $element.attr({
          name: name_id,
          id: name_id
        });
      }
      return $element;
    };

    Popup.prototype.createButton = function(text, valid) {
      var $element;
      $element = $('<button></button>').addClass('btn btn-default').attr('type', 'button').text(text);
      if ((valid != null) && valid === true) {
        $element.addClass('valid_button');
      }
      return $element;
    };

    Popup.prototype.createInputFileSave = function(id) {
      var $input;
      $input = $('<input></input>').attr('type', 'file').attr('nwsaveas', 'file.json');
      return $input;
    };

    Popup.prototype.createLabel = function(for_element_id, text) {
      var $element;
      $element = $('<label></label>').attr('for', for_element_id).text(text);
      return $element;
    };

    Popup.prototype.createSelectList = function(values, name_id, none_value) {
      var $element, $o, $option, j, len, value;
      $element = $('<select></select>').addClass('form-control');
      if ((name_id != null)) {
        $element.attr({
          name: name_id,
          id: name_id
        });
      }
      $option = $('<option></option>');
      for (j = 0, len = values.length; j < len; j++) {
        value = values[j];
        $o = $option.clone().attr('value', value).text(value);
        $element.append($o);
      }
      if (!((none_value != null) && none_value === false)) {
        $option.attr('value', '').text('');
        $element.prepend($option);
      }
      $element.on('keypress', function(args) {
        var ref;
        if (args.keyCode === 13) {
          $(this).blur();
          return (ref = $(this).closest('.popup').find('.valid_button')) != null ? ref.click() : void 0;
        }
      });
      return $element;
    };

    Popup.prototype.createPopup = function($header_array, $body_array, $footer_array, classname) {
      var $body, $footer, $header, $modal_content;
      $header = $('<div></div>').addClass('modal-header').append($header_array);
      $body = $('<div></div>').addClass('modal-body').append($body_array);
      $footer = $('<div></div>').addClass('modal-footer').append($footer_array);
      $modal_content = $('<div></div>').addClass('modal-content popup well').append([$header, $body, $footer]);
      if ((classname != null)) {
        $modal_content.addClass(classname);
      }
      $modal_content.popup({
        transition: 'all 0.1s'
      });
      return $modal_content;
    };

    Popup.prototype.createSideBlocks = function($elements, sizes) {
      var $div, $div_element, $elem, i, j, len;
      $div = $('<div></div>').addClass('row');
      for (i = j = 0, len = $elements.length; j < len; i = ++j) {
        $elem = $elements[i];
        $div_element = $('<div></div>').addClass('col-md-' + sizes[i]).append($elem);
        $div.append($div_element);
      }
      return $div;
    };

    Popup.prototype.createTitle = function(title) {
      var $title;
      $title = $('<h3></h3>').text(title);
      return $title;
    };

    Popup.prototype.createFieldset = function(title) {
      var $field, $legend;
      $field = $('<field></field>');
      $legend = $('<legend></legend>').text(title);
      $field.append($legend);
      return $field;
    };

    return Popup;

  })();

}).call(this);
