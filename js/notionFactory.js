// Originally generated by CoffeeScript 1.9.3
(function() {
  window.NotionFactory = (function() {
    NotionFactory.prototype.populateNode = function() {
      var $header, $img_add, $img_load, $node, $span_add, $span_load;
      $node = $('<div></div>').addClass('notion panel panel-default menu_notion').attr('id', 'add_notion');
      $header = $('<div></div>').addClass('panel-heading ctm-panel-heading');
      $span_add = $('<span></span>').text('Add notions');
      $img_add = $('<span></span>').addClass('add_notion span_action glyphicon glyphicon-plus');
      $img_add.on({
        click: (function(_this) {
          return function() {
            return _this.$notionFactory.trigger('addNotion');
          };
        })(this)
      });
      $header.append([$img_add, $span_add]);
      $node.append($header);
      return this.$notionFactory.append($node);
    };

    function NotionFactory($root) {
      this.$notionFactory = $root;
      this.notions = [];
      this.populateNode();
    }

    // --------------- Public methods ---------------
  
    // Create a new notion
    NotionFactory.prototype.createNotion = function(notion_name, class_attributes_model, instance_attributes_model) {
      var key, notion, value;
      notion = new Notion(notion_name);
      for (key in class_attributes_model) {
        value = class_attributes_model[key];
        notion.addClassAttributeModel(key, value);
      }
      for (key in instance_attributes_model) {
        value = instance_attributes_model[key];
        notion.addInstanceAttributeModel(key, value);
      }
      this.notions.push(notion);
      // /!\ notionCreated relative to draganddrop.js, not index.js
      this.$notionFactory.trigger('notionCreated', [notion]);

      return notion;
    };

    NotionFactory.prototype.getNotionFactoryNode = function() {
      return this.$notionFactory;
    };

    NotionFactory.prototype.getNotions = function() {
      return this.notions;
    };

    NotionFactory.prototype.clear = function() {
      this.$notionFactory.empty();
      this.populateNode();
      return this.notions = [];
    };

    return NotionFactory;

  })();

}).call(this);
