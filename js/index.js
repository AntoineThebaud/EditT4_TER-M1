// Originally generated by CoffeeScript 1.9.3
(function() {
  $(function() {
    var $notion,          applyListenersOnNewPopup, applyListenersOnNotionFactory,
        clearAll,         contextMenuItem,          contextMenuTable,
        createClass,      createInstance,           createNotion,
        createPopupClass, createPopupLoadClass,     dnd,
        instanceEvents,   notionFactory,            popupClass,
        popupDisplay,     popupFilter,              popupInstance,
        popupNotions,     popupImport,              popupSaver,
        popupTags,        tagsManager,              saver,
        table;

    // Nodes
    $notion = $('#notions');
    // Objects. Instanciate popups at the beginning since we could call them many times
    table = new Table();
    // 10 splits max of a cell
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
    popupImport = new PopupImport();
    
    // Clear the table and the notions
    clearAll = function() {
      table.clear();
      notionFactory.clear();
      return tagsManager.clear();
    };
    // Create and open the popup class
    createPopupClass = function(notion, notion_name, model, attributes) {
      popupClass.create(notion_name, model, attributes);
      popupClass.show();
      // When the class is created
      return popupClass.getNode().on({
        classCreated: function(e, class_attributes) {
          return createClass(notion_name, notion, class_attributes);
        }
      });
    };
    // Create and open the popup load class
    createPopupLoadClass = function(notion, notion_name) {
      popupLoadClass.create(saver.getSaves(), notion_name, notion.getClassAttributesModel(), notion.getInstanceAttributesModel());
      popupLoadClass.show();
      // When the class is created
      return popupLoadClass.getNode().on({
        loadClass: function(e, my_class) {
          return createClass(notion_name, notion, my_class['class_attributes']);
        }
      });
    };
    // Create a new notion
    //TODO : update attributes list after an import ?
    createNotion = function(notion_name, class_values, instance_values) {
      var $notion_node, notion;
      // We create the notion from the notionFactory
      notion = notionFactory.createNotion(notion_name, class_values, instance_values);
      // Get the node and append it to our notion root
      $notion_node = notion.getNotionNode();
      $notion.append($notion_node);
      // When the user want to create a class
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
    // Create a new class
    createClass = function(notion_name, notion, class_attributes) {
      var class_instance;
      class_instance = notion.createClass(class_attributes);
      class_instance.getClassNode().on({
        // Want to modify the class ?
        dblclick: function() {
          var $popupclass;
          popupClass.create(notion_name, class_instance.getClassAttributesModel(), class_instance.getClassAttributes(), 'Modify');
          popupClass.show();
          $popupclass = popupClass.getNode();
          // When the class is created
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
        // When an instance will be created from this class
        instanceCreated: function(e, instance) {
          return instanceEvents(notion_name, instance, true);
        }
      });
      return class_instance;
    };
    // Create a new instance
    createInstance = function(notion_name, my_class, instance_attributes, instance_tags, line, column) {
      var $element, $target, instance;
      instance = my_class.createInstance(instance_tags, true);
      instance.updateColorAndDisplayNodes(tagsManager.getDefaultColors(), tagsManager.getTagsConf());
      $element = instance.getInstanceNode();
      $target = table.getTableNode().find("tr:eq(" + line + ") td:eq(" + column + ")");
      table.createItem($element, $target);
      return instanceEvents(notion_name, instance, false);
    };
    // Apply some events to the instance
    // open -> true : automatically open a popup to edit informations of the instance
    instanceEvents = function(notion_name, instance, open) {
      // Function to set the attributes of an instance
      var setInstanceAttribute;
      setInstanceAttribute = function() {
        var $popupinstance;
        // Create a popup
        popupInstance.create(notion_name, instance.getClassAttributes(), instance.getInstanceAttributesModel(), instance.getInstanceAttributes(), instance.getInstanceTags());
        // Show it
        popupInstance.show();
        $popupinstance = popupInstance.getNode();
        // When it will be set, modify the instance attributes
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
      //don't show popup :
      // - while opening a projet
      // - if there is no utility to it (no instance attributes)
      if ((open != null) && open === true && !($.isEmptyObject(instance.getInstanceAttributesModel()))) {
        return setInstanceAttribute();
      }
    };
    // Apply some listeners to the popup new
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
    $('#alias_open_button').on({
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
        var dir = os.homedir()+path.sep+"EditT4";//TODO : ne marche pas avec nw.js post 13.0
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        this.nwworkingdir = dir;
        //resolve problem : onchange event was not triggered if the user choose the same file
        this.value = null;
      },
      change: function() {
        var fs = require('fs');
        fs.readFile(this.value, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          clearAll();
          saver.restoreData(JSON.parse(data), createNotion, createClass, createInstance);
          return;
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
        popupImport.create(notionFactory.getNotions());
        popupImport.getNode().on({
          importSet: function(e, import_notions) {
            for (var key in import_notions) {
              import_notion = import_notions[key];

              //cas 1 : New notion
              if(import_notion["mode"] == "New notion") {
                var new_notion = createNotion(key, import_notion["class_attributes_model"], import_notion["instance_attributes_model"]);
                for(var key2 in import_notion["classes"]) {
                  createClass(key, new_notion, import_notion["classes"][key2]);
                }
              }
              //cas 2 : Merge notion
              else if (import_notion["mode"].substring(0, 5) == "Merge") {
                var substr_notion = import_notion["mode"].replace("Merge with ", "");
                //targeted notion :
                var notions = notionFactory.getNotions();
                var notion_targeted;
                for(var i = 0; i < notions.length; ++i) {
                  if(notions[i]["name"] == substr_notion) {
                    notion_targeted = notions[i];
                  }
                }
                //for each class attribute
                for(var key2 in import_notion["class_attributes_modes"]) {
                  //create new attribute
                  if(import_notion["class_attributes_modes"][key2] == "New attribute") {
                    var att_values = "" //TODO : complete values (value1/value2/etc..)
                    notion_targeted.addClassAttributeModel(key2, import_notion["class_attributes_model"][key2]);
                  }
                  //merge with existing attribute
                  //
                  //méthode : ajouter attribut à chaque instance en copiant la valeur de l'ancien
                  //attribut dedans, puis supprimer ce dernier (/!\ exception pour les doublons)
                  else if (import_notion["class_attributes_modes"][key2].substring(0, 5) == "Merge") {
                    var substr_att = import_notion["class_attributes_modes"][key2].replace("Merge with ", "");
                    //update attribute for each instance
                    for(var key3 in import_notion["classes"]) {
                      if(substr_att != key2) {
                        import_notion["classes"][key3][substr_att] = import_notion["classes"][key3][key2];
                        delete import_notion["classes"][key3][key2];
                      }
                    }
                  }
                }
                //for each instance attribute
                for(var key2 in import_notion["instance_attributes_modes"]) {
                  //create new attribute
                  if(import_notion["instance_attributes_modes"][key2] == "New attribute") {
                    notion_targeted.addInstanceAttributeModel(key2, import_notion["instance_attributes_model"][key2]);
                  }
                  //merge with existing attribute
                  //
                  //méthode : ajouter attribut à chaque instance en copiant la valeur de l'ancien
                  //attribut dedans, puis supprimer ce dernier (/!\ exception pour les doublons)
                  else if (import_notion["instance_attributes_modes"][key2].substring(0, 5) == "Merge") {
                    var substr_att = import_notion["instance_attributes_modes"][key2].replace("Merge with ", "");
                    for(var key3 in import_notion["classes"]) {
                      if(substr_att != key2) {
                        import_notion["classes"][key3][substr_att] = import_notion["classes"][key3][key2];
                        delete import_notion["classes"][key3][key2];
                      }
                    }
                  }
                }
                //add new classes
                for(var key2 in import_notion["classes"]) {
                  createClass(notion_targeted["key"], notion_targeted, import_notion["classes"][key2]);
                }
              }
            }
          }
        });
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
            // Great complexity. Web workers ?
            for (j = 0, len = ref.length; j < len; j++) {
              notion = ref[j];
              results.push((function() {
                var k, len1, ref1, ref2, results1;
                ref1 = notion.getInstances();
                results1 = [];
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                  instance = ref1[k];
                  add_instance = true;
                  // We check if each constraint is ok
                  for (text in filters) {
                    contains = filters[text];
                    // By default, we say "the constraint is not ok unless we have an attribute which contains the text we want"
                    // By default, we say "the constraint is ok unless we have an attribute which contains the text we don't want"
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
    // Build the table (header, evenements), append to our page and apply listeners
    table.buildTable();
    $('#mytable').append(table.getTableNode());
    // Notion factory
    return applyListenersOnNotionFactory(notionFactory);
  });

}).call(this);
