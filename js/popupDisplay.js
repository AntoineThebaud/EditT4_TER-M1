// Generated by CoffeeScript 1.9.3
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.PopupDisplay = (function(superClass) {
    extend(PopupDisplay, superClass);

    function PopupDisplay() {
      this.$popupdisplay = null;
    }

    PopupDisplay.prototype.create = function(notions, tags_conf, default_colors) {
      var $body, $checkbox, $closebutton, $create_button, $group, $input, $label, $menu, $select, $table, $td, $title, $tr, attribute, conf, default_color, display, i, j, key, len, len1, name_color, notion, ref, ref1, tag;
      $body = $('<div></div>');
      $group = this.createFieldset('Cell display');
      $group.attr('id', 'cell_display');
      for (i = 0, len = notions.length; i < len; i++) {
        notion = notions[i];
        $title = $('<caption></caption>').text(notion.getName());
        $tr = $('<tr></tr>');
        $tr.append([$('<th></th>').text('Cell'), $('<th></th>').text('Tooltip')]);
        $table = $('<table></table>').addClass('table_notion_display').append([$title, $tr]);
        ref = notion.getDisplayAttributes();
        for (attribute in ref) {
          display = ref[attribute];
          $tr = $('<tr></tr>');
          ref1 = ['cell', 'tooltip'];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            key = ref1[j];
            $label = $('<label></label>').addClass('label_display').text(attribute);
            $input = this.createCheckbox('', attribute, display[key]);
            $label.prepend($input);
            $td = $('<td></td>').append($label);
            $tr.append($td);
          }
          $table.append($tr);
        }
        $group.append($table);
      }
      $body.append($group);
      $group = this.createFieldset('Tags color').attr('id', 'tags_color');
      $table = $('<table></table>').addClass('table_tags_color');
      $tr = $('<tr></tr>').append([$('<th></th>').text('Tag'), $('<th></th>').text('Color'), $('<th></th>').text('Display')]);
      $table.append($tr);
      for (tag in tags_conf) {
        conf = tags_conf[tag];
        $select = this.createSelectList(Object.keys(default_colors), 'select_' + tag, false);
        for (name_color in default_colors) {
          default_color = default_colors[name_color];
          if (default_color === conf['color']) {
            $select.val(name_color);
          }
        }
        $checkbox = this.createCheckbox('', 'check_' + tag, conf['display']);
        $tr = $('<tr></tr>').addClass('line_tag').attr('id', tag);
        $tr.append([$('<td></td>').text(tag), $('<td></td>').append($select), $('<td></td>').append($checkbox)]);
        $table.append($tr);
      }
      $group.append($table);
      $body.append($group);
      $create_button = this.createButton('Save', true);
      $create_button.on({
        click: (function(_this) {
          return function() {
            var $inputs, $line, $notion, k, l, len2, len3, len4, line, m, notion_display, notions_display, ref2, ref3, ref4, tags, tr;
            notions_display = [];
            tags = {};
            ref2 = $body.find('.table_notion_display');
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              notion = ref2[k];
              $notion = $(notion);
              notion_display = {};
              ref3 = $notion.find('tr');
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                tr = ref3[l];
                $tr = $(tr);
                $inputs = $tr.find('input');
                if ($inputs.length === 0) {
                  continue;
                }
                key = $inputs.eq(0).attr('id');
                notion_display[key] = {
                  cell: $inputs.eq(0).prop('checked'),
                  tooltip: $inputs.eq(1).prop('checked')
                };
              }
              notions_display.push(notion_display);
            }
            ref4 = $body.find('.table_tags_color .line_tag');
            for (m = 0, len4 = ref4.length; m < len4; m++) {
              line = ref4[m];
              $line = $(line);
              $select = $line.find('select');
              $checkbox = $line.find('input[type=checkbox]');
              tags[$line.attr('id')] = {
                color: default_colors[$select.val()],
                display: $checkbox.prop('checked')
              };
            }
            _this.$popupdisplay.trigger('displaySet', [notions_display, tags]);
            return _this.close();
          };
        })(this)
      });
      $closebutton = this.createCloseButton();
      $menu = $('<div></div>').append([$create_button, $closebutton]);
      this.$popupdisplay = this.createPopup([this.createTitle('Display')], [$body], [$menu], 'display');
      this.applyCloseButtonEvents($closebutton, this.$popupdisplay);
      this.$popupdisplay.css({
        'min-width': '400px',
        'max-width': '800px'
      });
      return this.$popupdisplay.on({
        close: (function(_this) {
          return function() {
            return _this.$popupdisplay.empty();
          };
        })(this)
      });
    };

    PopupDisplay.prototype.show = function() {
      return this.$popupdisplay.popup('show');
    };

    PopupDisplay.prototype.close = function() {
      return this.$popupdisplay.popup('hide');
    };

    PopupDisplay.prototype.getNode = function() {
      return this.$popupdisplay;
    };

    return PopupDisplay;

  })(Popup);

}).call(this);