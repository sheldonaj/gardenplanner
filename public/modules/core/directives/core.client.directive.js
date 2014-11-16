'use strict';

angular.module('core').directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
        return {
            restrict: 'A',
            link: function(scope, el, attrs, controller) {
                angular.element(el).attr('draggable', 'true');
 
                var id = angular.element(el).attr('id');
                if (!id) {
                    id = uuid.new();
                    angular.element(el).attr('id', id);
                }
                 
                el.bind('dragstart', function(e) {
                    e.dataTransfer.setData('text', id);
                    $rootScope.$emit('LVL-DRAG-START');
                });
                 
                el.bind('dragend', function(e) {
                    $rootScope.$emit('LVL-DRAG-END');
                });
            }
        };
    }]);

angular.module('core').directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
        return {
            restrict: 'A',
            scope: {
                onDrop: '&'
            },
            link: function(scope, el, attrs, controller) {
                var id = angular.element(el).attr('id');
                if (!id) {
                    id = uuid.new();
                    angular.element(el).attr('id', id);
                }
                            
                el.bind('dragover', function(e) {
                    if (e.preventDefault) {
                      e.preventDefault(); // Necessary. Allows us to drop.
                  }
                   
                  if(e.stopPropagation) { 
                    e.stopPropagation(); 
                  }
 
                  e.dataTransfer.dropEffect = 'move';
                  return false;
                });
                 
                el.bind('dragenter', function(e) {
                  angular.element(e.target).addClass('lvl-over');
                });
                 
                el.bind('dragleave', function(e) {
                  angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
                });
 
                el.bind('drop', function(e) {
                  if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                  }
 
                  if (e.stopPropogation) {
                    e.stopPropogation(); // Necessary. Allows us to drop.
                  }
 
                  var data = e.dataTransfer.getData('text');
                  var dest = document.getElementById(id);
                  var src = document.getElementById(data);
                     
                  var destEl = angular.element(dest);
                  var srcEl = angular.element(src);   

                  var myscope = destEl.scope();
                  //myscope.square = srcEl.attr('src');

                  destEl.attr('src', srcEl.attr('src'));
                 // destEl.attr('ng-src', srcEl.attr('ng-src'));
                  //clear the previously applied color, if it exists
          //var bgClass = destEl.attr('src');
          //if (bgClass) {
          //  dest.removeClass(bgClass);
          //}

          //add the dragged color
         // bgClass = src.attr("src");
          //dest.addClass(bgClass);
          //dest.attr('src', bgClass);

          //if element has been dragged from the grid, clear dragged color
         // if (drag.attr("x-lvl-drop-target")) {
         //   drag.removeClass(bgClass);
                  var plant = srcEl.attr('src');
                  var squareId = myscope.square.id;
                  scope.onDrop({dragPlant: plant, dropId: squareId});
                });
 
                $rootScope.$on('LVL-DRAG-START', function() {
                  var el = document.getElementById(id);
                  angular.element(el).addClass('lvl-target');
                });
                 
                $rootScope.$on('LVL-DRAG-END', function() {
                  var el = document.getElementById(id);
                  angular.element(el).removeClass('lvl-target');
                  angular.element(el).removeClass('lvl-over');
                });
            }
        };
    }]);
