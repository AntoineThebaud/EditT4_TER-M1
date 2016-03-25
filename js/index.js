// Generated by CoffeeScript 1.9.3
(function() {
  $(function() {
    var $notion, applyListenersOnNewPopup, applyListenersOnNotionFactory, clearAll, contextMenuItem, contextMenuTable, createClass, createInstance, createNotion, createPopupClass, createPopupLoadClass, dnd, instanceEvents, notionFactory, popupClass, popupDisplay, popupFilter, popupInstance, popupLoadClass, popupLoadNotion, popupNotions, popupRestore, popupSaver, popupTags, saver, table, tagsManager;
    $notion = $('#notions');
    table = new Table();
    contextMenuTable = new ContextMenuTable(table, 10);
    contextMenuItem = new ContextMenuItem(table);
    notionFactory = new NotionFactory($notion);
    tagsManager = new TagsManager();
    dnd = new Dnd(table, notionFactory, tagsManager);
    popupNotions = new PopupNotions();
    popupClass = new PopupClass();
    popupInstance = new PopupInstance();
    popupTags = new PopupTags();
    popupDisplay = new PopupDisplay();
    popupFilter = new PopupFilter();
    popupSaver = new PopupSaver();
    saver = new Saver(notionFactory, table, tagsManager);
    popupRestore = new PopupRestore();
    popupLoadNotion = new PopupLoadNotion();
    popupLoadClass = new PopupLoadClass();
    /************************[ ADDED : IMPORT ]*************************/
    var popupImport = new PopupImport();
    //test
    var $datas;
    /*******************************************************************/
    clearAll = function() {
      table.clear();
      notionFactory.clear();
      return tagsManager.clear();
    };
    createPopupClass = function(notion, notion_name, model, attributes) {
      popupClass.create(notion_name, model, attributes);
      popupClass.show();
      return popupClass.getNode().on({
        classCreated: function(e, class_attributes) {
          return createClass(notion_name, notion, class_attributes);
        }
      });
    };
    createPopupLoadClass = function(notion, notion_name) {
      popupLoadClass.create(saver.getSaves(), notion_name, notion.getClassAttributesModel(), notion.getInstanceAttributesModel());
      popupLoadClass.show();
      return popupLoadClass.getNode().on({
        loadClass: function(e, my_class) {
          return createClass(notion_name, notion, my_class['class_attributes']);
        }
      });
    };
    createNotion = function(notion_name, class_values, instance_values) {
      var $notion_node, notion;
      notion = notionFactory.createNotion(notion_name, class_values, instance_values);
      $notion_node = notion.getNotionNode();
      $notion.append($notion_node);
      $notion_node.on({
        addClass: function() {
          return createPopupClass(notion, notion_name, class_values, class_values);
        },
        loadClass: function() {
          return createPopupLoadClass(notion, notion_name);
        }
      });
      table.addColumn(notion_name);
      return notion;
    };
    createClass = function(notion_name, notion, class_attributes) {
      var class_instance;
      class_instance = notion.createClass(class_attributes);
      class_instance.getClassNode().on({
        dblclick: function() {
          var $popupclass;
          popupClass.create(notion_name, class_instance.getClassAttributesModel(), class_instance.getClassAttributes(), 'Modify');
          popupClass.show();
          $popupclass = popupClass.getNode();
          return $popupclass.on({
            classCreated: function(e, class_attributes) {
              var key, results, val;
              results = [];
              for (key in class_attributes) {
                val = class_attributes[key];
                results.push(class_instance.setClassAttributeValue(key, val));
              }
              return results;
            }
          });
        },
        instanceCreated: function(e, instance) {
          return instanceEvents(notion_name, instance, true);
        }
      });
      return class_instance;
    };
    createInstance = function(notion_name, my_class, instance_attributes, instance_tags, line, column) {
      var $element, $target, instance;
      instance = my_class.createInstance(instance_tags, true);
      instance.updateColorAndDisplayNodes(tagsManager.getDefaultColors(), tagsManager.getTagsConf());
      $element = instance.getInstanceNode();
      $target = table.getTableNode().find("tr:eq(" + line + ") td:eq(" + column + ")");
      table.createItem($element, $target);
      return instanceEvents(notion_name, instance, false);
    };
    instanceEvents = function(notion_name, instance, open) {
      var setInstanceAttribute;
      setInstanceAttribute = function() {
        var $popupinstance;
        popupInstance.create(notion_name, instance.getClassAttributes(), instance.getInstanceAttributesModel(), instance.getInstanceAttributes(), instance.getInstanceTags());
        popupInstance.show();
        $popupinstance = popupInstance.getNode();
        return $popupinstance.on({
          instanceSet: function(e, instance_attributes, instance_tags) {
            instance.setInstanceAttributesValues(instance_attributes);
            instance.setInstanceTags(instance_tags);
            instance.updateNode();
            return instance.updateColorAndDisplayNodes(tagsManager.getDefaultColors(), tagsManager.getTagsConf());
          }
        });
      };
      instance.getInstanceNode().on({
        dblclick: setInstanceAttribute,
        itemMoved: function(e, $new_element) {
          instance.setInstanceNode($new_element);
          return instanceEvents(notion_name, instance, false);
        }
      });
      if ((open != null) && open === true) {
        return setInstanceAttribute();
      }
    };
    applyListenersOnNotionFactory = function(factory) {
      return factory.getNotionFactoryNode().on({
        addNotion: function() {
          popupNotions.create();
          popupNotions.getNode().on({
            notionsCreated: function(e, objects) {
              var notion_name, results, values;
              results = [];
              for (notion_name in objects) {
                values = objects[notion_name];
                results.push(createNotion(notion_name, values['class'], values['instance']));
              }
              return results;
            }
          });
          return popupNotions.show();
        },
        loadNotion: function() {
          popupLoadNotion.create(saver.getSaves());
          popupLoadNotion.getNode().on({
            loadNotion: function(e, notion) {
              var attribute, notion_instance, ref, results, value;
              notion_instance = createNotion(notion.name, notion['class_attributes_model'], notion['instance_attributes_model']);
              ref = notion['display_attributes'];
              results = [];
              for (attribute in ref) {
                value = ref[attribute];
                results.push(notion_instance.updateDisplayAttributes(attribute, value['cell'], value['tooltip']));
              }
              return results;
            }
          });
          return popupLoadNotion.show();
        }
      });
    };
    table.getTableNode().on({
      tableChanged: function(event) {
        return $(event.currentTarget).colResize();
      }
    });
    $('#new_button').on({
      click: function() {
        return clearAll();
      }
    });
    $('#fake_open_button').on({
      click: function() {
        $('#open_button').click();
      }
    });
    $('#open_button').on({
      click: function() {
        //ensure that the browser starts in the right directory
        var fs = require('fs');
        var os = require('os');
        var path = require('path');
        var dir = os.homedir()+path.sep+"Editor";
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        this.nwworkingdir = dir;
        //resolve problem : onchange event is triggered even if the user choose the same file
        this.value = null;
      },
      change: function() {
        var fs = require('fs');
        fs.readFile(this.value, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          clearAll();
          return saver.restoreData(JSON.parse(data), createNotion, createClass, createInstance);
        });
      }
    });
    $('#save_button').on({
      click: function() {
        popupSaver.create(notionFactory.getNotions());
        popupSaver.getNode().on({
          saverSet: function(e, filename, to_save) {
            return saver.save(filename, to_save);
          }
        });
        return popupSaver.show();
      }
    });
    $('#import_button').on({
      click: function() {
        popupImport.create();
        return popupImport.show();
      }
    });
    $('#tags_button').on({
      click: function() {
        popupTags.create(tagsManager.getTags());
        popupTags.getNode().on({
          tagsSet: function(e, tags) {
            var instance, j, len, notion, ref, results;
            if (tags) {
              tagsManager.setTags(tags);
              ref = notionFactory.getNotions();
              results = [];
              for (j = 0, len = ref.length; j < len; j++) {
                notion = ref[j];
                results.push((function() {
                  var k, len1, ref1, results1;
                  ref1 = notion.getInstances();
                  results1 = [];
                  for (k = 0, len1 = ref1.length; k < len1; k++) {
                    instance = ref1[k];
                    instance.updateDiffInstanceTags(tags);
                    results1.push(instance.updateColorAndDisplayNodes(tagsManager.getDefaultColors(), tagsManager.getTagsConf()));
                  }
                  return results1;
                })());
              }
              return results;
            }
          }
        });
        return popupTags.show();
      }
    });
    $('#display_button').on({
      click: function() {
        popupDisplay.create(notionFactory.getNotions(), tagsManager.getTagsConf(), tagsManager.getDefaultColors());
        popupDisplay.getNode().on({
          displaySet: function(e, notions_display, tags_conf) {
            var attribute, display_attribute, i, j, notion, notion_display, notions, ref, results;
            tagsManager.setTagsConf(tags_conf);
            notions = notionFactory.getNotions();
            results = [];
            for (i = j = 0, ref = notions_display.length - 1; j <= ref; i = j += 1) {
              notion_display = notions_display[i];
              notion = notions[i];
              for (display_attribute in notion_display) {
                attribute = notion_display[display_attribute];
                notion.updateDisplayAttributes(display_attribute, attribute['cell'], attribute['tooltip']);
              }
              notion.updateInstanceNodes();
              results.push(notion.updateInstanceColorAndDisplayNodes(tagsManager.getDefaultColors(), tagsManager.getTagsConf()));
            }
            return results;
          }
        });
        return popupDisplay.show();
      }
    });
    $('#filter_button').on({
      click: function() {
        popupFilter.create(tagsManager.getTags());
        popupFilter.getNode().on({
          filterSet: function(e, tag, filters) {
            var add_instance, constraint_ok, contains, instance, j, len, name, notion, ref, results, text, value;
            if (filters === {}) {
              return;
            }
            ref = notionFactory.getNotions();
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
              notion = ref[j];
              results.push((function() {
                var k, len1, ref1, ref2, results1;
                ref1 = notion.getInstances();
                results1 = [];
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                  instance = ref1[k];
                  add_instance = true;
                  for (text in filters) {
                    contains = filters[text];
                    constraint_ok = !contains;
                    ref2 = Utils.merge(instance.getClassAttributes(), instance.getInstanceAttributes());
                    for (name in ref2) {
                      value = ref2[name];
                      if (value.indexOf(text) !== -1) {
                        if (contains === true) {
                          constraint_ok = true;
                        } else {
                          constraint_ok = false;
                        }
                        break;
                      }
                    }
                    if (constraint_ok === false) {
                      add_instance = false;
                      break;
                    }
                  }
                  if (add_instance === true) {
                    instance.addInstanceTag(tag);
                    results1.push(instance.updateColorAndDisplayNodes(tagsManager.getDefaultColors(), tagsManager.getTagsConf()));
                  } else {
                    results1.push(void 0);
                  }
                }
                return results1;
              })());
            }
            return results;
          }
        });
        return popupFilter.show();
      }
    });
    $(document).on({
      mousedown: function() {
        return table.setMouseDown(true);
      },
      mouseup: function() {
        return table.setMouseDown(false);
      }
    });
    table.buildTable();
    $('#mytable').append(table.getTableNode());
    return applyListenersOnNotionFactory(notionFactory);
  });

}).call(this);
