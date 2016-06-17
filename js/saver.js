// Originally generated by CoffeeScript 1.9.3
(function() {
  window.Saver = (function() {
    function Saver(notionFactory, table1, tagsManager) {
      this.notionFactory = notionFactory;
      this.table = table1;
      this.tagsManager = tagsManager;
    }

    Saver.prototype.save = function(filename, to_save) {
      var $node,            $td,            $tds,
          $tr,              $trs,           act_rowspan,
          candidate_notion, class_to_save,  diff,
          i,                instance,       instance_to_save,
          j,                k,              l,
          len,              len1,           len2,
          m,                my_class,       n, 
          next_rowspan,     notion,         notion_to_save,
          notions,          o,              ref,
          ref1,             ref2,           ref3,
          save,             table;

      save = {
        name: to_save['name'],
        description: to_save['description'],
        structure: null,
        notions: [],
        tags: null,
        tagsColor: null
      };

      // Save notions, classes and instances (with their positions in the table)
      notions = this.notionFactory.getNotions();
      for (k = 0, len = notions.length; k < len; k++) {
        notion = notions[k];
        candidate_notion = to_save.notions[notion.getName()];
        if (candidate_notion.notion === false) {
          continue;
        }
        notion_to_save = {
          name: notion.getName(),
          class_attributes_model: notion.getClassAttributesModel(),
          instance_attributes_model: notion.getInstanceAttributesModel(),
          display_attributes: notion.getDisplayAttributes(),
          class_instances: []
        };
        ref = notion.getClassInstances();
        // Save classes
        for (l = 0, len1 = ref.length; l < len1; l++) {
          my_class = ref[l];
          if (candidate_notion.classes === false) {
            continue;
          }
          class_to_save = {
            class_attributes: my_class.getClassAttributes(),
            instances: []
          };
          notion_to_save.class_instances.push(class_to_save);
          ref1 = my_class.getInstances();
          // Save instances
          for (m = 0, len2 = ref1.length; m < len2; m++) {
            instance = ref1[m];
            if (candidate_notion.instances === false) {
              continue;
            }
            $node = instance.getInstanceNode();
            $td = $node.parent();
            instance_to_save = {
              instance_attributes: instance.getInstanceAttributes(),
              instance_tags: null,
              line: $td.parent().parent().children().index($td.parent()),
              column: $td.parent().children().index($td)
            };
            if (to_save.tags === true) {
              instance_to_save.instance_tags = instance.getInstanceTags();
            }
            class_to_save.instances.push(instance_to_save);
          }
        }
        save.notions.push(notion_to_save);
      }
      // Save the structure of the table (number of rows, which cells are splitted...)
      if (to_save.structure === true) {
        table = {
          lineNumber: this.table.getLineNumber(),
          split: []
        };
        $trs = this.table.getTableNode().find('tr');
        for (i = n = 0, ref2 = $trs.length - 1; n <= ref2; i = n += 1) {
          $tr = $trs.eq(i);
          $tds = $tr.find('td');
          $td = $tds.eq(0);
          for (j = o = 0, ref3 = $tds.length - 1; o <= ref3; j = o += 1) {
            act_rowspan = $td.attr('rowspan');
            if (isNaN(act_rowspan)) {
              act_rowspan = 1;
            }
            next_rowspan = $tds.eq(j).attr('rowspan');
            if (isNaN(next_rowspan)) {
              next_rowspan = 1;
            }
            if (act_rowspan !== next_rowspan) {
              diff = act_rowspan - next_rowspan + 1;
              table.split.push({
                line: i,
                column: j,
                number_of_splits: diff
              });
            }
            $td = $tds.eq(j);
          }
        }
        save.structure = table;
      }
      if (to_save.tags === true) {
        save.tags = this.tagsManager.getTags();
        save.tagsConf = this.tagsManager.getTagsConf();
      }

      var fs = require('fs');
      fs.writeFile(filename, JSON.stringify(save), function(err) {
        if (err) {
          return console.log(err);
        }
        return console.log('saved '+filename);
      });
    };

    // restore is a hash
    // createNotion, createClass and createInstance are functions
    // createNotion(notion_name, class_values, instance_values)
    // createClass(notion_name, notion, class_attributes)
    // createInstance(notion_name, my_class, instance_attributes, instance_tags, line, column)
    Saver.prototype.restoreData = function(restore, createNotion, createClass, createInstance) {
      var $element,         attribute,          create_instance,
          create_instances, display_attribute,  i,
          instance,         k,                  l,
          len,              len1,               len2,
          len3,             len4,               m,
          my_class,         n,                  notion,
          o,                p,                  ref,
          ref1,             ref2,               restore_class_instance,
          restore_class_instances,              restore_instance, 
          restore_notion,   restore_notions,    restore_table,
          results,          to_split;

      restore_notions = restore.notions;
      create_instances = [];

      // Display the name & description of the project
      $('#p_name').text(restore['name']);
      $('#p_desc').text(restore['description'])

      // Set the tags and tag colors to the manager
      // Before all ! (for example new instances will use this)
      if ((restore.tags != null)) {
        this.tagsManager.setTags(restore.tags);
        this.tagsManager.setTagsConf(restore.tagsConf);
      }
      for (k = 0, len = restore_notions.length; k < len; k++) {
        // Create the notion and set the display attributes
        restore_notion = restore_notions[k];
        notion = createNotion(restore_notion['name'], restore_notion['class_attributes_model'], restore_notion['instance_attributes_model']);
        for (attribute in restore_notion['display_attributes']) {
          display_attribute = restore_notion['display_attributes'][attribute];
          notion.updateDisplayAttributes(attribute, display_attribute['cell'], display_attribute['tooltip']);
        }
        // Create the class instances
        restore_class_instances = restore_notion['class_instances'];
        for (l = 0, len1 = restore_class_instances.length; l < len1; l++) {
          restore_class_instance = restore_class_instances[l];
          // Create the class
          my_class = createClass(notion.getName(), notion, restore_class_instance['class_attributes']);
          ref = restore_class_instance['instances'];
          for (m = 0, len2 = ref.length; m < len2; m++) {
            restore_instance = ref[m];
            create_instance = {
              notion_name: notion.getName(),
              my_class: my_class,
              instance_attributes: restore_instance['instance_attributes'],
              instance_tags: restore_instance['instance_tags'],
              line: restore_instance['line'],
              column: restore_instance['column']
            };
            // Keep in mind the attributes of the instances (with their positions etc)
            // We can't create it for now because we need to create the table before
            create_instances.push(create_instance);
          }
        }
      }
      // Create the table
      if ((restore.structure != null)) {
        restore_table = restore.structure;
        for (i = n = 1, ref1 = restore_table['lineNumber'] - 1; n <= ref1; i = n += 1) {
          this.table.addRow();
        }
        ref2 = restore_table.split;
        // Split cells
        for (o = 0, len3 = ref2.length; o < len3; o++) {
          to_split = ref2[o];
          $element = this.table.getTableNode().find("tr:eq(" + to_split.line + ") td:eq(" + to_split.column + ")");
          this.table.splitCell($element, to_split.number_of_splits);
        }
        results = [];
        // Create and put in the right cells the instances
        for (p = 0, len4 = create_instances.length; p < len4; p++) {
          instance = create_instances[p];
          results.push(createInstance(instance['notion_name'], instance['my_class'], instance['instance_attributes'], instance['instance_tags'], instance['line'], instance['column']));
        }
        return results;
      }
    };

    return Saver;

  })();

}).call(this);
