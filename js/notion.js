// Generated by CoffeeScript 1.9.3
(function() {
  window.Notion = (function() {
    Notion.prototype.createNotionNode = function(name) {
      var $actions, $body, $header, $img_add, $img_load, $node, $panel;
      $node = $('<div></div>').addClass('col-sm-6 notion_root');
      $panel = $('<div></div>').addClass('notion panel panel-default').attr('id', name);
      $header = $('<div></div>').addClass('panel-heading').text(name);
      $body = $('<ul></ul>').addClass('list-group');
      $actions = $('<span></span>');
      $img_add = $('<span></span>').addClass('icon span_action glyphicon glyphicon-plus');
      $img_add.on({
        click: (function(_this) {
          return function() {
            return $node.trigger('addClass');
          };
        })(this)
      });
      $img_load = $('<span></span>').addClass('icon span_action glyphicon glyphicon-floppy-open');
      $img_load.on({
        click: (function(_this) {
          return function() {
            return $node.trigger('loadClass');
          };
        })(this)
      });
      $actions.prepend($img_add).append($img_load);
      $header.append($actions);
      $panel.append([$header, $body]);
      $node.append($panel);
      return $node;
    };

    Notion.prototype.addClassNode = function(class_instance) {
      return this.$notion.find('.list-group').append(class_instance.getClassNode());
    };

    function Notion(name1) {
      this.name = name1;
      this.class_attributes_model = {};
      this.instance_attributes_model = {};
      this.class_instances = [];
      this.$notion = this.createNotionNode(this.name);
      this.display_attributes = {};
    }

    Notion.prototype.getClassAttributesModel = function() {
      return this.class_attributes_model;
    };

    Notion.prototype.getInstanceAttributesModel = function() {
      return this.instance_attributes_model;
    };

    Notion.prototype.getClassInstances = function() {
      return this.class_instances;
    };

    Notion.prototype.getNotionNode = function() {
      return this.$notion;
    };

    Notion.prototype.getName = function() {
      return this.name;
    };

    Notion.prototype.setName = function(new_name) {
      return this.name = new_name;
    };

    Notion.prototype.addClassAttributeModel = function(name, values) {
      this.class_attributes_model[name] = values;
      return this.updateDisplayAttributes(name);
    };

    Notion.prototype.addInstanceAttributeModel = function(name, values) {
      this.instance_attributes_model[name] = values;
      return this.updateDisplayAttributes(name);
    };

    Notion.prototype.getDisplayAttributes = function() {
      return this.display_attributes;
    };

    Notion.prototype.createClass = function(class_attributes_values) {
      var class_instance, key, name, value;
      name = class_attributes_values['name'];
      if (name === "") {
        console.error('Class name should be empty');
        return;
      }
      class_instance = new Class(this.name, name, this.class_attributes_model, this.instance_attributes_model, this.display_attributes);
      for (key in class_attributes_values) {
        value = class_attributes_values[key];
        class_instance.setClassAttributeValue(key, value);
      }
      this.class_instances.push(class_instance);
      this.addClassNode(class_instance);
      this.$notion.trigger('classCreated', [class_instance]);
      return class_instance;
    };

    Notion.prototype.updateInstanceNodes = function() {
      var i, instance, len, ref, results;
      ref = this.getInstances();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        instance = ref[i];
        results.push(instance.updateNode());
      }
      return results;
    };

    Notion.prototype.updateInstanceColorAndDisplayNodes = function(colors, tags_conf) {
      var i, instance, len, my_class, ref, results;
      ref = this.class_instances;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        my_class = ref[i];
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = my_class.getInstances();
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            instance = ref1[j];
            results1.push(instance.updateColorAndDisplayNodes(colors, tags_conf));
          }
          return results1;
        })());
      }
      return results;
    };

    Notion.prototype.updateDisplayAttributes = function(attribute, value_cell, value_tooltip) {
      if (value_cell == null) {
        value_cell = false;
        value_tooltip = false;
        if (attribute === 'name') {
          value_cell = true;
          value_tooltip = true;
        }
      }
      return this.display_attributes[attribute] = {
        cell: value_cell,
        tooltip: value_tooltip
      };
    };

    Notion.prototype.getInstances = function() {
      var i, instances, len, my_class, ref;
      instances = [];
      ref = this.class_instances;
      for (i = 0, len = ref.length; i < len; i++) {
        my_class = ref[i];
        instances = instances.concat(my_class.getInstances());
      }
      return instances;
    };

    return Notion;

  })();

}).call(this);
